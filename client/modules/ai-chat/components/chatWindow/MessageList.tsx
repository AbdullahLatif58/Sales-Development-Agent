import AssistantMessage from "./AssistantMessages";
import UserMessage from "./UserMessage";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ConversationData = {
  conversation: {
    id: string;
    title: string;
  };
  message: Message[];
};

type Props = {
  isLoading: boolean;
  error: unknown;
  conversation?: ConversationData;
};



export default function MessageList({ isLoading, error, conversation }: Props) {
  if (isLoading) {
    return <div className="text-center text-zinc-500">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Failed to load messages.</div>;
  }

  if (!conversation || !conversation.message) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      {conversation.message.map((message) =>
        message.role === "assistant" ? (
          <AssistantMessage
            key={message.id}
            message={message.content}
          />
        ) : (
          <UserMessage
            key={message.id}
            message={message.content}
          />
        )
      )}
    </div>
  );
}