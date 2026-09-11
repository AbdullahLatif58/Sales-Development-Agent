import { createQwenTokenizer } from "../tokenizers/qwen.tokenizer.js";
import { TokenCounter } from "../token.counter.js";
import { ContextReducer } from "./context.reducer.js";

const tokenizer = await createQwenTokenizer();

const tokenCounter = new TokenCounter(tokenizer);

const reducer = new ContextReducer(tokenCounter);

const messages = [
  {
    role: "system" as const,
    content: "You are Ava, an AI SDR.",
  },
  {
    role: "user" as const,
    content:
      "Hello, I need an ecommerce website for my business.",
  },
  {
    role: "assistant" as const,
    content:
      "Sure. What kind of ecommerce business do you run?",
  },
  {
    role: "user" as const,
    content:
      "I sell clothing online and need payments and order management.",
  },
  {
    role: "assistant" as const,
    content:
      "That sounds good. How many products do you expect to have?",
  },
];

const result = await reducer.trim(
  messages,
  40
);

console.log("\nORIGINAL MESSAGES:");
console.log(messages);

console.log("\nTRIMMED MESSAGES:");
console.log(result);

console.log("\nORIGINAL COUNT:");
console.log(
  tokenCounter.countMessages(messages)
);

console.log("\nTRIMMED COUNT:");
console.log(
  tokenCounter.countMessages(result)
);