export interface Conversation {
  id: string;
  title: string | null;
  updated_at: string;
}

export interface ConversationSidebarProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
}

export interface ConversationListProps
  extends ConversationSidebarProps {
  conversations: Conversation[];
}

export interface ConversationItemProps {
  conversation: Conversation;
  selected: boolean;
  onClick: () => void;
}