export type AIRole = "system" | "user" | "assistant";

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
}

export interface AIResponse {
  message: AIMessage;
}
