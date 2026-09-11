import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  type BaseMessage,
} from "@langchain/core/messages";

import type { ContextMessage } from "../context.types.js";

export class LangChainMessageAdapter {
  toLangChain(
    messages: ContextMessage[]
  ): BaseMessage[] {
    return messages.map((message) => {
      switch (message.role) {
        case "system":
          return new SystemMessage(message.content);

        case "user":
          return new HumanMessage(message.content);

        case "assistant":
          return new AIMessage(message.content);
      }
    });
  }

  toContextMessages(
  messages: BaseMessage[]
): ContextMessage[] {
  return messages.map((message) => {
    switch (message.type) {
      case "system":
        return {
          role: "system",
          content: message.text,
        };

      case "human":
        return {
          role: "user",
          content: message.text,
        };

      case "ai":
        return {
          role: "assistant",
          content: message.text,
        };

      default:
        throw new Error(
          `Unsupported LangChain message type: ${message.type}`
        );
    }
  });
}
}