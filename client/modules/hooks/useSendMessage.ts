import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi, type StreamEvent } from "../api/chat";

type SendMessageVariables = {
  user_id: string;
  conversationId: string;
  message: string;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: SendMessageVariables) => {
      let activeConversationId = variables.conversationId;

      await chatApi.sendMessage(
        variables,
        (event: StreamEvent) => {
          if (event.type === "conversation") {
            activeConversationId = event.data.conversationId;

            queryClient.setQueryData(
              ["conversation", activeConversationId],
              (oldData: any) => {
                if (!oldData) {
                  return {
                    conversation: {
                      id: activeConversationId,
                      title: event.data.title ?? "New Conversation",
                    },
                    message: [],
                  };
                }

                return {
                  ...oldData,
                  conversation: {
                    ...oldData.conversation,
                    id: activeConversationId,
                    title:
                      event.data.title ??
                      oldData.conversation.title,
                  },
                };
              }
            );

            queryClient.invalidateQueries({
              queryKey: ["conversations"],
            });
          }

          if (event.type === "token") {
            queryClient.setQueryData(
              ["conversation", activeConversationId],
              (oldData: any) => {
                if (!oldData) return oldData;

                return {
                  ...oldData,
                  message: oldData.message.map((msg: any) =>
                    msg.id === "streaming-assistant"
                      ? {
                          ...msg,
                          content:
                            msg.content + event.data.content,
                        }
                      : msg
                  ),
                };
              }
            );
          }

          if (event.type === "done") {
            activeConversationId = event.data.conversationId;
          }

          if (event.type === "error") {
            throw new Error(event.data.message);
          }
        }
      );

      return {
        conversationId: activeConversationId,
      };
    },

    async onMutate(variables) {
      const conversationId = variables.conversationId;

      if (!conversationId) {
        return {
          previousConversation: undefined,
        };
      }

      await queryClient.cancelQueries({
        queryKey: ["conversation", conversationId],
      });

      const previousConversation = queryClient.getQueryData([
        "conversation",
        conversationId,
      ]);

      const optimisticUserMessage = {
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: "user",
        content: variables.message,
        created_at: new Date().toISOString(),
      };

      const optimisticAssistantMessage = {
        id: "streaming-assistant",
        conversation_id: conversationId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData(
        ["conversation", conversationId],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            message: [
              ...oldData.message,
              optimisticUserMessage,
              optimisticAssistantMessage,
            ],
          };
        }
      );

      return {
        previousConversation,
        conversationId,
      };
    },

    onError: (_error, variables, context) => {
      if (!context?.conversationId) return;

      queryClient.setQueryData(
        ["conversation", context.conversationId],
        context.previousConversation
      );
    },

    onSettled: (_data, _error, variables) => {
      if (variables.conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["conversation", variables.conversationId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};