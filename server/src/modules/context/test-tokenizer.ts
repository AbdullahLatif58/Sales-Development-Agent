import { createQwenTokenizer } from "./tokenizers/qwen.tokenizer.js";
import { TokenCounter } from "./token.counter.js";
import { TokenAnalyzer } from "./token.analyzer.js";
import { TokenBudget } from "./token.budget.js";
import { ContextManager } from "./context.manager.js";
import { ContextMessage } from "./context.types.js";

const tokenizer = await createQwenTokenizer();

const tokenCounter = new TokenCounter(tokenizer);

const tokenAnalyzer = new TokenAnalyzer(
  tokenCounter
);

const tokenBudget = new TokenBudget({
  modelLimit: 8192,
  maxOutputTokens: 1024,
  safetyMargin: 256,
});

const contextManager = new ContextManager(
  tokenAnalyzer,
  tokenBudget
);

const systemPrompt =
  "You are an AI sales assistant.";

const historyMessages: ContextMessage[] = [
  {
    role: "user",
    content: "Hello, I am looking for a CRM.",
  },
  {
    role: "assistant",
    content: "Sure, I can help you find the right CRM.",
  },
];

const currentMessage =
  "What features should I look for?";

const result = contextManager.analyze(
  systemPrompt,
  historyMessages,
  currentMessage
);

console.log("\nContext Analysis");
console.log("------------------------");

console.log(
  "System:",
  result.analysis.systemTokens
);

console.log(
  "History:",
  result.analysis.historyTokens
);

console.log(
  "Current message:",
  result.analysis.currentMessageTokens
);

console.log(
  "Total input:",
  result.analysis.totalInputTokens
);

console.log(
  "Status:",
  result.status
);

console.log("------------------------");