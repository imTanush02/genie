import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, Message, TextMessage } from "@inngest/agent-kit";

/**
 * Retries an async function on 429 rate-limit errors with exponential backoff.
 * Parses the `retry_after_seconds` from OpenRouter error metadata when available.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 4,
  baseDelayMs: number = 5000
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      const isLastAttempt = attempt === maxRetries;
      
      // Check if it's a rate-limit error (429)
      const errMsg = err instanceof Error ? err.message : String(err);
      const is429 = errMsg.includes("429") || errMsg.includes("rate-limit") || errMsg.includes("RESOURCE_EXHAUSTED");
      
      if (!is429 || isLastAttempt) {
        throw err;
      }

      // Try to parse retry-after from the error
      let delayMs = baseDelayMs * Math.pow(2, attempt);
      const retryMatch = errMsg.match(/retry.*?(\d+\.?\d*)\s*s/i);
      if (retryMatch) {
        delayMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1000; // add 1s buffer
      }

      console.log(`Rate limited (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delayMs}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("retryWithBackoff: unreachable");
}

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);

  return sandbox;
};

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant",
  );

  const message = result.output[lastAssistantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
};
export const parseAgentOutput = (value: Message[]) => {
  const output = value[0];

  if (output.type !== "text") {
    return "Fragment";
  }

  if (Array.isArray(output.content)) {
    return output.content.map((txt) => txt).join("")
  } else {
    return output.content
  }
};