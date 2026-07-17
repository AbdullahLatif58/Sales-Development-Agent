"use client";

import { useState } from "react";

import ChatBox from "@/modules/ai-chat/components/chatWindow/ChatWindow";
import ConversationSidebar from "@/modules/ai-chat/components/conversationSideBar/ConversationSidebar";

export default function ChatPage() {
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-zinc-900">
      <ConversationSidebar
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      <ChatBox
        conversationId={selectedConversationId}
      />
    </main>
  );
}