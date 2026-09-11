import { trimMessages } from "@langchain/core/messages";

import type {
  ContextInput,
  ContextMessage,
  ContextReductionResult,
} from "../context.types.js";

import { TokenAnalyzer } from "../token.analyzer.js";
import { TokenBudget } from "../token.budget.js";
import { TokenCounter } from "../token.counter.js";
import { LangChainMessageAdapter } from "./langchain.message.adapter.js";

export class ContextReducer {
  private readonly adapter =
    new LangChainMessageAdapter();

  constructor(
    private readonly tokenCounter: TokenCounter,
    private readonly tokenAnalyzer: TokenAnalyzer,
    private readonly tokenBudget: TokenBudget
  ) {}

  async trim(
    context: ContextInput
  ): Promise<ContextReductionResult> {
    const messages: ContextMessage[] = [
      {
        role: "system",
        content: context.systemPrompt,
      },
      ...context.historyMessages,
      {
        role: "user",
        content: context.currentMessage,
      },
    ];

    const langChainMessages =
      this.adapter.toLangChain(messages);

    const trimmer = trimMessages({
      strategy: "last",

      maxTokens:
        this.tokenBudget.getAvaialableTokens(),

      tokenCounter: (messages) => {
        return this.tokenCounter.countMessages(
          this.adapter.toContextMessages(messages)
        );
      },

      includeSystem: true,
    });

    const trimmedMessages =
      await trimmer.invoke(langChainMessages);

    const reducedMessages =
      this.adapter.toContextMessages(
        trimmedMessages
      );

    const reducedSystemPrompt =
      reducedMessages.find(
        (message) => message.role === "system"
      )?.content ?? context.systemPrompt;

    const reducedConversation =
      reducedMessages.filter(
        (message) => message.role !== "system"
      );

    const reducedCurrentMessage =
      reducedConversation.at(-1);

    const reducedHistoryMessages =
      reducedConversation.slice(0, -1);

    const analysis =
      this.tokenAnalyzer.analyze(
        reducedSystemPrompt,
        reducedHistoryMessages,
        reducedCurrentMessage?.content ?? ""
      );

    return {
      systemPrompt: reducedSystemPrompt,
      historyMessages: reducedHistoryMessages,
      currentMessage:
        reducedCurrentMessage?.content ?? "",
      analysis,
    };
  }
}