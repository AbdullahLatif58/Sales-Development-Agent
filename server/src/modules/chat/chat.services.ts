import type { AIProvider } from "../ai/ai.provider.js";
import { SYSTEM_PROMPT } from "../../core/prompts/sdr.prompt.js";
import { Conversation } from "../conversation/conversation.stores.js";

  export class chatService {
   constructor(private readonly aiProvider: AIProvider){};
  
    private conversation: Conversation | null = null;
   
    async sendMessage(message: string) {

    if (!this.conversation) {

      this.conversation = new Conversation(crypto.randomUUID(), [

        {

          role: "system",

          content: SYSTEM_PROMPT,

        },

      ]);

    }

     this.conversation.addUserMessages(message);
     console.log(this.conversation);
    const response = await this.aiProvider.chat({

      messages: this.conversation.getMessages(),

    });

    this.conversation.addAssistantMessage(response.message.content);

    return response;

  }
  }