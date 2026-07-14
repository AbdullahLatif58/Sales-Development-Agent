import type { AIRequest, AIResponse } from "./ai.types.js";

export interface AIProvider {
  chat(request: AIRequest): Promise<AIResponse>;
  generateConversationTitle(firstMessage: string): Promise<string>;

}