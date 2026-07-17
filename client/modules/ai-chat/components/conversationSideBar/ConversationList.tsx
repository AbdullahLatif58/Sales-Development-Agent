"use client";

import ConversationItem from "./ConversationItem";
import { ConversationListProps } from "./type";

export default function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          selected={selectedConversationId === conversation.id}
          onClick={() =>
            onSelectConversation(
              selectedConversationId === conversation.id
                ? null
                : conversation.id
            )
          }
        />
      ))}
    </div>
  );
}