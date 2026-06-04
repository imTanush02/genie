// src/inngest/functions.ts
import { inngest } from "./client";
import { createAgent, createTool, createNetwork, openai, gemini, type Tool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { PROMPT } from "@/prompt";
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
    const codeAgent = createAgent<AgentState>({
      name: 'codeAgent',
      description: "expert coding agent , use this to generate code for the prompt given to you",
      system: PROMPT,
      // ========== PRIMARY: Gemini 2.5 Flash (FREE, 1M context, excellent at coding) ==========
      model: gemini({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
      }),

      // ========== ALT 1: Qwen3 Coder via OpenRouter (FREE, 1M context, coding-focused) ==========
      // model: openai({
      //   model: "qwen/qwen3-coder:free",
      //   baseUrl: 'https://openrouter.ai/api/v1/',
      //   apiKey: process.env.OPENROUTER_API_KEY,
      // }),

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

    try {
      result = await network.run(event.data.value);
      console.log("network result: ", result);
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
          content: result!.state.data.summary ?? "Task completed.",
          type: "RESULT",
          role: "ASSISTANT",
          projectId: event.data.projectId,
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              files: result!.state.data.files ?? {},
              title: "fragment"
            }
          }
        }
      })
    })

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result!.state.data.files,
      summary: result!.state.data.summary
    };
  }
);

