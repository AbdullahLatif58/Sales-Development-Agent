import { TokenBudget } from "./token.budget.js";

const budget = new TokenBudget({
  modelLimit: 8192,
  maxOutputTokens: 1024,
  safetyMargin: 256,
});

const availableInputTokens =
  budget.getAvaialableTokens();

console.log("\nToken Budget");
console.log("------------------------");
console.log("Model context limit:", 8192);
console.log("Max output tokens:", 1024);
console.log("Safety margin:", 256);
console.log("Available input:", availableInputTokens);

console.log("------------------------");

console.log(
  "5000 tokens fit:",
  budget.canFit(5000)
);

console.log(
  "7000 tokens fit:",
  budget.canFit(7000)
);

console.log(
  "6912 tokens fit:",
  budget.canFit(6912)
);

console.log(
  "6913 tokens fit:",
  budget.canFit(6913)
);