import { AIMessage } from "../ai/ai.types.js";

export interface Conversation {
   id: string;
   message: AIMessage[];
   created_at: Date;
   updated_at: Date;
}
