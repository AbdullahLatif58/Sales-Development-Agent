import type { Request, Response } from "express";
import { ChatService } from "./chat.services.js";
import { ConversationRepository } from "../conversation/conversation.repository.js";
import { MessageRepository } from "../messages/messages.repository.js";
import { OllamaProvider } from "../ai/ollama.provider.js";

const conversationRepository = new ConversationRepository();
const messageRepository = new MessageRepository();
const aiProvider = new OllamaProvider();

const chatService = new ChatService(
    conversationRepository,
    messageRepository,
    aiProvider
);

export async function sendMessage(req: Request, res: Response) {
    try {
        const response = await chatService.sendMessage(req.body);

        return res.status(200).json({
            success: true,
            conversationId: response.conversationId,
            message: response.message,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error",
        });
    }
}