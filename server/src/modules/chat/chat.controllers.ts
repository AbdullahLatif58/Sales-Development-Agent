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
    // Tell the client that this is a streaming response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Start the service stream
    const stream = chatService.streamMessage(req.body);

    // Consume events from the service
    for await (const event of stream) {
      res.write(
        `event: ${event.type}\n` +
        `data: ${JSON.stringify(event)}\n\n`
      );
    }

    // Stream finished
    res.end();
  } catch (error) {
    console.error(error);

    // If headers have already been sent,
    // we cannot send a normal JSON response anymore.
    if (res.headersSent) {
      res.write(
        `event: error\n` +
        `data: ${JSON.stringify({
          message:
            error instanceof Error
              ? error.message
              : "Internal Server Error",
        })}\n\n`
      );

      return res.end();
    }

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error",
    });
  }
}