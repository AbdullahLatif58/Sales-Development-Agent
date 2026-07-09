
import { AIMessage } from "../ai/ai.types.js";



export class Conversation {
  constructor(
    public readonly id: string,

    private readonly messages: AIMessage[],

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date()
  ) {}


   getMessages(): AIMessage[] {

    return this.messages;

  }

   addUserMessages(content: string) {
    this.messages.push({
      role: "user",
      content
    });
 this.updatedAt = new Date();
   }

  addAssistantMessage(content: string): void {

    this.messages.push({

      role: "assistant",

      content,

    });

    this.updatedAt = new Date();

  }
  
}


  