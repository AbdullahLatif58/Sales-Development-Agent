import type { AIProvider } from "../../ai/ai.provider.js";
import type { ContextMessage } from "../context.types.js";

const SUMMARY_SYSTEM_PROMPT = `
You summarize conversation context for future AI responses.

Keep important facts, requirements, decisions, preferences, budget,
timeline, objections, and open questions.

Remove greetings, repetition, filler, and irrelevant details.
Do not invent information.
Return only a concise factual summary.
`;

export class ContextSummarizer {
  constructor(
    private readonly aiProvider: AIProvider
  ) {}

  async summarize(
    messages: ContextMessage[],
    previousSummary?: string
  ): Promise<string> {
    if (messages.length === 0 && !previousSummary) {
      return "";
    }

    const conversation = messages
      .map((message) => {
        return `${message.role}: ${message.content}`;
      })
      .join("\n");

    const content = previousSummary
      ? `
Previous summary:
${previousSummary}

New conversation:
${conversation}
`
      : `
Conversation:
${conversation}
`;

    const response = await this.aiProvider.chat({
      messages: [
        {
          role: "system",
          content: SUMMARY_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content,
        },
      ],
    });

    return response.message.content.trim();
  }
}