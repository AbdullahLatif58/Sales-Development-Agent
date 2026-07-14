import type { AIProvider } from "../ai/ai.provider.js";
import { SYSTEM_PROMPT } from "../../core/prompts/sdr.prompt.js";
import type { sendMessage } from "./chat.types.js";
import { ConversationRepository } from "../conversation/conversation.repository.js";
import { MessageRepository } from "../messages/messages.repository.js";
import { spawn } from "node:child_process";
  export class ChatService {
   constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly aiProvider: AIProvider
) {}

    async sendMessage(request: sendMessage) {
    const {user_id, conversationId, message} = request
      let conversation;
     if(!conversationId) {
       conversation = await this.conversationRepository.create(user_id);

     }else {
      conversation = await this.conversationRepository.getById(conversationId);
       if(!conversation){
        throw new Error("conversation doesnt exist");
       }
     }

      await this.messageRepository.create(
      conversation.id, 
      "user", 
      message
    );
   const history = await this.messageRepository.getByConversationId(
      conversation.id
    );


    const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT
    },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content
    }))
    ]
   const response = await this.aiProvider.chat({
    messages
   });
 
  await this.messageRepository.create(conversation.id, "assistant",  response.message.content);

  return {
    conversationId: conversation.id,
    message: response.message.content
  }
  }
  }