import type {
  ContextMessage,
  ContextResult,
} from "./context.types.js";

import { TokenAnalyzer } from "./token.analyzer.js";
import { TokenBudget } from "./token.budget.js";
import { ContextReducer } from "./reducer/context.reducer.js";

export class ContextManager {
  constructor(
    private readonly tokenAnalyzer: TokenAnalyzer,
    private readonly tokenBudget: TokenBudget,
    private readonly contextReducer: ContextReducer
  ) {}

  async analyze(
    systemPrompt: string,
    historyMessages: ContextMessage[],
    currentMessage: string
  ): Promise<ContextResult> {
    // 1. Analyze the original context
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

    
    if (canFit) {
      return {
        status: "fit",
        analysis,
      };
    }

    
    const reducedContext =
      await this.contextReducer.trim({
        systemPrompt,
        historyMessages,
        currentMessage,
      });

   
    const reducedCanFit =
      this.tokenBudget.canFit(
        reducedContext.analysis.totalInputTokens
      );

    return {
      status: reducedCanFit
        ? "fit"
        : "too_large",
      analysis: reducedContext.analysis,
    };
  }
}