// src/inngest/functions.ts
import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import { getSandbox } from "./utils";


export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id" , async () => {
      const sandbox = await Sandbox.create({
        template: "tanushsingh843/genie-nextjs-test2"
      })
      return sandbox.sandboxId
    })
    const codeAgent= createAgent({
      name: 'codeAgent',
      system: "you are a code agent who generate the code for the prompt given to you",
      model: gemini({ model: "gemini-2.5-flash" }),
    });
    const { output } = await codeAgent.run(`generate code for this prompt : ${event.data.value}`);
    console.log(output[0].content);

    const sandboxUrl = await step.run("get-sandbox-url" , async () => {
      const sandbox = await getSandbox(sandboxId);
      const host =  await sandbox.getHost(3000);
      return `https://${host}`
    });

    return { output , sandboxUrl };
  }
);

