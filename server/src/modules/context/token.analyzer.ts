import { TokenAnalysis, ContextMessage } from "./context.types.js";
import { TokenCounter } from "./token.counter.js";
export class TokenAnalyzer {
   constructor (private readonly tokenCounter: TokenCounter) {}
   
   analyze(
      systemPrompt: string,
      historyMessages: ContextMessage[],
      currentMessage: string
   ): TokenAnalysis {
      const systemTokens = this.tokenCounter.countText(systemPrompt);

      const historyTokens = this.tokenCounter.countMessages(historyMessages);

      const currentMessageTokens = this.tokenCounter.countText(currentMessage);

      const totalInputTokens = systemTokens + historyTokens + currentMessageTokens;

      return {
         systemTokens,
         historyTokens,
         currentMessageTokens,
         totalInputTokens
      }
   }
}