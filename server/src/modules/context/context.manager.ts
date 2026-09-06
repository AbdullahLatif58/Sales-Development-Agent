import type {
  ContextMessage,
  ContextResult,
} from "./context.types.js";

import { TokenAnalyzer } from "./token.analyzer.js";
import { TokenBudget } from "./token.budget.js";

export class ContextManager {
  constructor(
    private readonly tokenAnalyzer: TokenAnalyzer,
    private readonly tokenBudget: TokenBudget
  ) {}

  analyze(
    systemPrompt: string,
    historyMessages: ContextMessage[],
    currentMessage: string
  ): ContextResult {
    const analysis =
      this.tokenAnalyzer.analyze(
        systemPrompt,
        historyMessages,
        currentMessage
      );

    const canFit =
      this.tokenBudget.canFit(
        analysis.totalInputTokens
      );

    return {
      status: canFit ? "fit" : "too_large",
      analysis,
    };
  }
}