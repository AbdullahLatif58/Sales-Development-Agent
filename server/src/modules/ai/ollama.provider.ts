import { Ollama } from "ollama";

import type { AIProvider } from "./ai.provider.js";
import type { AIRequest, AIResponse } from "./ai.types.js";



export class OllamaProvider implements AIProvider {

   private client = new Ollama({
      host: "http://localhost:11434"
   });


  async chat(request: AIRequest): Promise<AIResponse> {
   const response = await this.client.chat({
      model: "qwen3:8b",
      messages: request.messages,
   });

   return {
      message:{
         role:"assistant",
         content: response.message.content,
      }
   }
  }
}