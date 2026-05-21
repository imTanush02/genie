// src/inngest/functions.ts
import { inngest } from "./client";
import { gemini, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox, lastAssistantTextMessageContent } from "./utils";
import { stderr, stdout, title } from "process";
import z from "zod";
import { PROMPT } from "@/prompt";
import { url } from "inspector";


export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create({
        template: "tanushsingh843/genie-nextjs-test2"
      })
      return sandbox.sandboxId
    })
    const codeAgent = createAgent({
      name: 'codeAgent',
      description: "expert coding agent , use this to generate code for the prompt given to you",
      system: PROMPT,
      model: gemini({ model: "gemini-2.5-flash-lite" }),
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
          handler: async ({ files }, { step, network }) => {
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
            if (typeof newFiles !== "string") {
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

    const network = createNetwork({
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

    const result = await network.run(event.data.value);

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getSandbox(sandboxId);
      const host = await sandbox.getHost(3000);
      return `https://${host}`
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary
    };
  }
);

