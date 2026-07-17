"use client";

import Button from "@/modules/shared/ui/Button";
import Input from "@/modules/shared/ui/Input";
import ConversationList from "./ConversationList";
import { Plus, Search } from "lucide-react";
import { useConversations } from "@/modules/hooks/useConversation";
import { ConversationSidebarProps } from "./type";

export default function ConversationSidebar({
  selectedConversationId,
  onSelectConversation,
}: ConversationSidebarProps) {
  const {
    data: conversations = [],
    isLoading,
    error,
  } = useConversations(
    "550e8400-e29b-41d4-a716-446655440000"
  );

  return (
    <aside className="flex h-screen w-80 flex-col border-r border-zinc-800 bg-zinc-950 text-white">
      <div className="border-b border-zinc-800 p-5">
        <h1 className="text-xl font-bold tracking-tight">
          AI SDR
        </h1>

        <p className="mt-1 text-sm text-zinc-400">
          Enterprise AI Assistant
        </p>
      </div>

      <div className="p-5">
        <Button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700">
          <Plus size={18} />
          New Conversation
        </Button>
      </div>

      <div className="px-5">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <Input
            placeholder="Search..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-10 pr-4 text-sm placeholder:text-zinc-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex-1 overflow-hidden">
        <h2 className="mb-4 px-5 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Conversations
        </h2>

        <div className="h-full overflow-y-auto px-3 pb-5">
          {isLoading && (
            <div className="py-8 text-center text-zinc-500">
              Loading...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              Failed to load conversations.
            </div>
          )}

          {!isLoading && (
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={onSelectConversation}
            />
          )}
        </div>
      </div>

      <div className="border-t border-zinc-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold">
            A
          </div>

          <div>
            <p className="font-medium">Abdullah</p>

            <p className="text-xs text-zinc-500">
              Enterprise Plan
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}