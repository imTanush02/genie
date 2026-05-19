// src/inngest/functions.ts
import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";


export const processTask = inngest.createFunction(
  { id: "process-task", triggers: { event: "app/task.created" } },
  async ({ event, step }) => {
    const codeAgent= createAgent({
      name: 'codeAgent',
      system: "you are a code agent who generate the code for the prompt given to you",
      model: gemini({ model: "gemini-2.5-flash" }),
    });
    const { output } = await codeAgent.run(`generate code for this prompt : ${event.data.value}`);
    console.log(output[0].content);

    return { message: `code generated : ${output[0].content}` };
  }
);

