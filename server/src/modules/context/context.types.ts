export type ContextMessageRole = | "system" | "user" | "assistant"

export interface ContextMessage {
   role: ContextMessageRole,
   content: string
}



export interface TokenAnalysis {
  systemTokens: number;
  historyTokens: number;
  currentMessageTokens: number;
  totalInputTokens: number;
}




export interface TokenBudgetConfig {
   modelLimit: number;
   maxOutputTokens: number;
   safetyMargin: number;
}


export interface TokenBudget {
  availableInputTokens: number;
}