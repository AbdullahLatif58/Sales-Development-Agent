export type ContextMessageRole =
  | "system"
  | "user"
  | "assistant";

export interface ContextMessage {
  role: ContextMessageRole;
  content: string;
}

export interface ContextInput {
  systemPrompt: string;
  historyMessages: ContextMessage[];
  currentMessage: string;
}

export interface TokenAnalysis {
  systemTokens: number;
  historyTokens: number;
  currentMessageTokens: number;
  totalInputTokens: number;
}

export type ContextStatus =
  | "fit"
  | "too_large";

export interface ContextResult {
  status: ContextStatus;
  analysis: TokenAnalysis;
}

export interface ContextReductionResult {
  systemPrompt: string;
  historyMessages: ContextMessage[];
  currentMessage: string;
  analysis: TokenAnalysis;
}