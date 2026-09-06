import type { AIProvider } from "../ai/ai.provider.js";
import { SYSTEM_PROMPT } from "../../core/prompts/sdr.prompt.js";
import type { sendMessage } from "./chat.types.js";
import { ConversationRepository } from "../conversation/conversation.repository.js";
import { MessageRepository } from "../messages/messages.repository.js";
import { ContextManager } from "../context/context.manager.js";

export class ChatService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly messageRepository: MessageRepository,
    private readonly aiProvider: AIProvider,
    private readonly contextManager: ContextManager
  ) {}

  async sendMessage(request: sendMessage) {
    const { user_id, conversationId, message } = request;

    let conversation;

    if (!conversationId) {
      conversation =
        await this.conversationRepository.create(user_id);

      const title =
        await this.aiProvider.generateConversationTitle(message);

      await this.conversationRepository.updateTitle(
        conversation.id,
        title
      );
    } else {
      conversation =
        await this.conversationRepository.getById(conversationId);

      if (!conversation) {
        throw new Error("conversation doesnt exist");
      }
    }

    await this.messageRepository.create(
      conversation.id,
      "user",
      message
    );

    const history =
      await this.messageRepository.getByConversationId(
        conversation.id
      );

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const contextResult =
      await this.contextManager.analyze(
        SYSTEM_PROMPT,
        history,
        message
      );

    if (contextResult.status === "too_large") {
      throw new Error("Context window exceeded");
    }

    const response =
      await this.aiProvider.chat({
        messages,
      });

    await this.messageRepository.create(
      conversation.id,
      "assistant",
      response.message.content
    );

    return {
      conversationId: conversation.id,
      message: response.message.content,
    };
  }

  async *streamMessage(request: sendMessage) {
    const { user_id, conversationId, message } = request;

    let conversation;
    let title: string | undefined;

    if (!conversationId) {
      conversation =
        await this.conversationRepository.create(user_id);

      title =
        await this.aiProvider.generateConversationTitle(
          message
        );

      await this.conversationRepository.updateTitle(
        conversation.id,
        title
      );
    } else {
      conversation =
        await this.conversationRepository.getById(
          conversationId
        );

      if (!conversation) {
        throw new Error("conversation doesnt exist");
      }
    }

    await this.messageRepository.create(
      conversation.id,
      "user",
      message
    );

    const history =
      await this.messageRepository.getByConversationId(
        conversation.id
      );

    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const contextResult =
      await this.contextManager.analyze(
        SYSTEM_PROMPT,
        history,
        message
      );

    if (contextResult.status === "too_large") {
      throw new Error("Context window exceeded");
    }

    yield {
      type: "conversation" as const,
      conversationId: conversation.id,
      title,
    };

    let fullResponse = "";

    const stream =
      this.aiProvider.streamChat({
        messages,
      });

    for await (const chunk of stream) {
      fullResponse += chunk;

      yield {
        type: "token" as const,
        content: chunk,
      };
    }

    await this.messageRepository.create(
      conversation.id,
      "assistant",
      fullResponse
    );

    yield {
      type: "done" as const,
      conversationId: conversation.id,
    };
  }
}