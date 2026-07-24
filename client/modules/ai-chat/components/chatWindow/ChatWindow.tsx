"use client";

import Button from "@/modules/shared/ui/Button";
import MessageList from "./MessageList";
import { Send, Sparkles, Bot } from "lucide-react";
import { useConversation } from "@/modules/hooks/useConversation";
import { useState } from "react";
import { useSendMessage } from "@/modules/hooks/useSendMessage";

type Props = {
  conversationId: string | null;
};

export default function ChatBox({ conversationId }: Props) {
  const { isLoading, error, data } = useConversation(conversationId);
 const [input, setInput] = useState("");
 const sendMessage = useSendMessage();

  
  function handleSend() {
    const content = input.trim();
    if(!content) return ;
    sendMessage.mutate({
      user_id: "550e8400-e29b-41d4-a716-446655440000",
      conversationId: conversationId || "",
      message: content
    });
    setInput(" ");
    console.log("Sending Message to Ai:", content);
  }


  return (
    <section className="flex h-screen flex-1 flex-col bg-zinc-900 text-white">
     
      <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-lg font-semibold">
            {conversationId
              ? isLoading
                ? "Loading..."
                : data?.conversation.title || "New Conversation"
              : "AI SDR"}
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {conversationId
              ? "AI SDR Assistant"
              : "Enterprise AI Sales Development Representative"}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          <Sparkles size={16} />
          Online
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
        {!conversationId ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-2xl text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600">
                <Bot size={38} />
              </div>

              <h1 className="mt-6 text-3xl font-bold">
                Welcome to AI SDR
              </h1>

              <p className="mt-4 text-zinc-400">
                Your enterprise AI Sales Development Representative.
                Qualify leads, generate personalized outreach, analyze
                prospects, and automate your sales conversations from one
                workspace.
              </p>

              <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <h3 className="font-semibold">
                    🚀 Lead Qualification
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    Qualify inbound leads using intelligent conversations.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <h3 className="font-semibold">
                    ✉ Personalized Outreach
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    Generate cold emails and follow-ups in seconds.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <h3 className="font-semibold">
                    🎯 Prospect Research
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    Analyze companies before reaching out.
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                  <h3 className="font-semibold">
                    🤖 AI Automation
                  </h3>

                  <p className="mt-2 text-sm text-zinc-400">
                    Automate repetitive SDR workflows with AI.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MessageList
            isLoading={isLoading}
            error={error}
            conversation={data}
          />
        )}
      </main>

      {/* Composer */}
      <footer className="border-t border-zinc-800 p-4 sm:p-6">
        <div className="mx-auto flex max-w-5xl items-end gap-4 rounded-2xl border border-zinc-700 bg-zinc-950 p-4">
         <textarea
         onKeyDown={(e)=> {
            if(e.key === "Enter" ){
              e.preventDefault();
              handleSend();
            }
           }}
          rows={1}
          value={input}
           onChange={(e) => setInput(e.target.value)}
           placeholder="Message AI SDR..."
         
         className="
         min-h-[28px]
         max-h-40
         flex-1
         resize-none
         bg-transparent
         text-white
         outline-none
         placeholder:text-zinc-500
         disabled:cursor-not-allowed
          disabled:opacity-50
  "
/>

          <Button
           
            onClick={handleSend}
            disabled={!conversationId}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-blue-600
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Send size={18} />
          </Button>
        </div>
      </footer>
    </section>
  );
}