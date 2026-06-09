// src/inngest/functions.ts
import { inngest } from "./client";
import { createAgent, createTool,createState, createNetwork, openai, gemini, type Tool  , type Message } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent, parseAgentOutput } from "./utils";
import z from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import prisma from "@/lib/db";

interface AgentState {
  summary: string;
  files: {[path:string]: string};
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", triggers: { event: "code-agent/run" } },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create({
        template: "tanushsingh843/genie-nextjs-test2" 
      })
      return sandbox.sandboxId
    })
    const previousMessages = await step.run("get-previous-messages", async () => {
      const formattedMessages: Message[] = [];

      const messages = await prisma.message.findMany({
        where: {
          projectId: event.data.projectId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      for (const message of messages) {
        formattedMessages.push({
          type: "text",
          role: message.role === "ASSISTANT" ? "assistant" : "user",
          content: message.content,
        })
      }

      return formattedMessages.reverse();
    });

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      },
    );


    const codeAgent = createAgent<AgentState>({
      name: 'codeAgent',
      description: "expert coding agent , use this to generate code for the prompt given to you",
      system: PROMPT,
      // ========== PRIMARY: Gemini 2.5 Flash (PAID/LIMITED FREE TIER) ==========
      // model: gemini({
      //   model: "gemini-2.5-flash",
      //   apiKey: process.env.GEMINI_API_KEY,
      // }),

      // ========== DEV: Qwen3 Coder via OpenRouter (FREE, 1M context, coding-focused) ==========
      model: openai({
        model: "qwen/qwen3-coder:free",
        baseUrl: 'https://openrouter.ai/api/v1/',
        apiKey: process.env.OPENROUTER_API_KEY,
      }),

      tools: [
        createTool({
          name: 'terminal',
          description: 'use this tool to run terminal commands',
          parameters: z.object({
            command: z.string()
          }),

          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await getSandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout(data: string) {
                    buffers.stdout += data;

                  },
                  onStderr(data: string) {
                    buffers.stderr += data;
                  }
                })
                return result.stdout
              } catch (e) {
                console.error(`Command failed : ${e} \n stdout : ${buffers.stdout} \n stderr : ${buffers.stderr}`);
                return `Command failed : ${e} \n stdout : ${buffers.stdout} \n stderr : ${buffers.stderr}`
              }
            })
          }
        }),

        createTool({
          name: "createOrUpdateFiles",
          description: "use this tool to create or update files in the sandbox",
          parameters: z.object({
            files: z.array(z.object({
              path: z.string(),
              content: z.string()
            }))
          }),
          handler: async ({ files }, { step, network }:Tool.Options<AgentState>) => {
            const newFiles = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updateFiles = network.state.data.files || {}
                const sandbox = await getSandbox(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updateFiles[file.path] = file.content;
                }
                return updateFiles;
              } catch (e) {
                console.error(`File creation failed : ${e}`);
                return `File creation failed : ${e}`;
              }
            })
            if (newFiles && typeof newFiles !== "string") {
              network.state.data.files = newFiles;
            }

          }
        }),

        createTool({
          name: "readFiles",
          description: "use this tool to read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string())
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getSandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content })
                }
                return JSON.stringify(contents);
              } catch (e) {
                console.error(`File creation failed : ${e}`);
                return `File creation failed : ${e}`;
              }
            })


          }
        })
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState : state,
      router: async ({ network }) => {
        const summary = network.state.data.summary
        if (summary) {
          return
        }
        return codeAgent
      }
    })

    let result: Awaited<ReturnType<typeof network.run>>;
    let networkError: string | null = null;
    let fragmentTitleOuput: Message[] | undefined;
    let responseOutput: Message[] | undefined;

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({ 
        model: "meta-llama/llama-4-maverick:free",
        baseUrl: 'https://openrouter.ai/api/v1/',
        apiKey: process.env.OPENROUTER_API_KEY,
      }),
    })

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: openai({ 
        model: "meta-llama/llama-4-maverick:free",
        baseUrl: 'https://openrouter.ai/api/v1/',
        apiKey: process.env.OPENROUTER_API_KEY,
      }),
    });

    
    try {
      result = await network.run(event.data.value , {state});
      console.log("network result: ", result);

      ({ output: fragmentTitleOuput } = await fragmentTitleGenerator.run(result.state.data.summary));
      ({ output: responseOutput } = await responseGenerator.run(result.state.data.summary));
    } catch (err) {
      networkError = err instanceof Error ? err.message : "Task failed.";
      console.error("network error: ", err);
    }


    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = await sandbox.getHost(3000);
      return `https://${host}`
    });

    await step.run("save-result", async () => {
      if(networkError){
        return await prisma.message.create({
          data: {
            content: networkError ?? "Task failed.",
            type: "ERROR",
            role: "ASSISTANT",
            projectId: event.data.projectId,
          }
        })
      }
       return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput!),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOuput!),
              files: result!.state.data.files,
            },
          },
        },
      })
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result!.state.data.files,
      summary: result!.state.data.summary
    };
  }
);

