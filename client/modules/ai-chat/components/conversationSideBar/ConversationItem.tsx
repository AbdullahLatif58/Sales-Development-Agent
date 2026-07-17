"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useConversationMutations } from "@/modules/hooks/useConversation";
import { ConversationItemProps } from "./type";

export default function ConversationItem({
  conversation,
  selected,
  onClick,
}: ConversationItemProps) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title ?? "");

  const menuRef = useRef<HTMLDivElement>(null);

  const { remove, update } = useConversationMutations();

  useEffect(() => {
    setTitle(conversation.title ?? "");
  }, [conversation.title]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  function handleRename() {
    const newTitle = title.trim();

    if (!newTitle || newTitle === conversation.title) {
      setTitle(conversation.title ?? "");
      setIsEditing(false);
      return;
    }

    update.mutate(
      {
        id: conversation.id,
        title: newTitle,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setIsEditing(false);
        },
      }
    );
  }

  return (
    <div
      onClick={() => {
        if (!isEditing) {
          onClick();
        }
      }}
      className={`group relative mb-2 flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 transition ${
        selected
          ? "border-blue-500 bg-zinc-800"
          : "border-transparent hover:border-zinc-800 hover:bg-zinc-900"
      }`}
    >
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            autoFocus
            value={title}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();

              if (e.key === "Escape") {
                setTitle(conversation.title ?? "");
                setIsEditing(false);
              }
            }}
            className="w-full rounded-lg border border-blue-500 bg-zinc-800 px-3 py-2 text-sm outline-none"
          />
        ) : (
          <>
            <p className="truncate text-sm font-medium">
              {conversation.title ?? "New Conversation"}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {new Date(
                conversation.updated_at
              ).toLocaleDateString()}
            </p>
          </>
        )}
      </div>

      {!isEditing && (
        <div
          ref={menuRef}
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
          >
            <MoreHorizontal size={18} />
          </button>

          {open && (
            <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  setIsEditing(true);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-zinc-800"
              >
                <Pencil size={16} />
                Rename
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  remove.mutate(conversation.id, {
                    onSuccess: () => {
                      setOpen(false);
                    },
                  });
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}