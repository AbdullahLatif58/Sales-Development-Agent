import type { Request, Response } from "express";

import { ChatService } from "./chat.services.js";

import { ConversationRepository } from "../conversation/conversation.repository.js";
import { MessageRepository } from "../messages/messages.repository.js";
import { OllamaProvider } from "../ai/ollama.provider.js";

import { ContextManager } from "../context/context.manager.js";
import { TokenAnalyzer } from "../context/token.analyzer.js";
import { TokenBudget } from "../context/token.budget.js";
import { TokenCounter } from "../context/token.counter.js";

import { createQwenTokenizer } from "../context/tokenizers/qwen.tokenizer.js";

const conversationRepository =
  new ConversationRepository();

const messageRepository =
  new MessageRepository();

const aiProvider =
  new OllamaProvider();

const tokenizer =
  await createQwenTokenizer();

const tokenCounter =
  new TokenCounter(tokenizer);

const tokenAnalyzer =
  new TokenAnalyzer(tokenCounter);

const tokenBudget =
  new TokenBudget({
    modelLimit: 8192,
    maxOutputTokens: 1024,
    safetyMargin: 256,
  });

const contextManager =
  new ContextManager(
    tokenAnalyzer,
    tokenBudget
  );

const chatService =
  new ChatService(
    conversationRepository,
    messageRepository,
    aiProvider,
    contextManager
  );

export async function sendMessage(
  req: Request,
  res: Response
) {
  try {
    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    const stream =
      chatService.streamMessage(req.body);

    for await (const event of stream) {
      res.write(
        `event: ${event.type}\n` +
        `data: ${JSON.stringify(event)}\n\n`
      );
    }

    res.end();
  } catch (error) {
    console.error(error);

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