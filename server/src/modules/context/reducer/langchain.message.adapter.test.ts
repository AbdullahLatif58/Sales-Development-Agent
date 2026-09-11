import { LangChainMessageAdapter } from "./langchain.message.adapter.js";

const adapter = new LangChainMessageAdapter();

const messages = adapter.toLangChain([
  {
    role: "system",
    content: "You are Ava, an AI SDR.",
  },
  {
    role: "user",
    content: "I need an ecommerce website.",
  },
  {
    role: "assistant",
    content:
      "Sure, what kind of ecommerce business do you run?",
  },
]);

console.log("LANGCHAIN MESSAGES:");
console.log(messages);

console.log("\nMESSAGE TYPES:");

for (const message of messages) {
  console.log(message.type);
}

console.log("\nMESSAGE TEXT:");

for (const message of messages) {
  console.log(message.text);
}