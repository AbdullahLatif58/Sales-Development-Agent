import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../api/chat";

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chatApi.sendMessage,

    async onMutate(variables) {
      // Stop any in-flight fetches for this conversation
      await queryClient.cancelQueries({
        queryKey: ["conversation", variables.conversationId],
      });

      // Backup the current cache
      const previousConversation = queryClient.getQueryData([
        "conversation",
        variables.conversationId,
      ]);

      // Create optimistic user message
      const optimisticUserMessage = {
        id: crypto.randomUUID(),
        conversation_id: variables.conversationId,
        role: "user",
        content: variables.message,
        created_at: new Date().toISOString(),
      };

      // Create optimistic assistant placeholder
      const optimisticAssistantMessage = {
        id: "typing",
        conversation_id: variables.conversationId,
        role: "assistant",
        content: "...",
        created_at: new Date().toISOString(),
      };

      // Update the cache immediately
      queryClient.setQueryData(
        ["conversation", variables.conversationId],
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
     
      // Return context for rollback
      return {
        previousConversation,
      };

    
    },
     onSuccess(response, variables) {
      queryClient.setQueryData(
         ["conversation", variables.conversationId]
         , (oldData: any) => {
            if (!oldData) return oldData;
            return {
               ...oldData,
              message: oldData.message.map((msg: any) =>
  msg.id === "typing"
    ? {
        id: crypto.randomUUID(),
        conversation_id: variables.conversationId,
        role: "assistant",
        content: response.message,
        created_at: new Date().toISOString(),
      }
    : msg
)
            }
         });
         
     },
     onError: (_error, variables, context) => {

      queryClient.setQueryData(

    ["conversation", variables.conversationId],
   
     context?.previousConversation
 
  );

     },

    onSettled: (_, __, variables) => {
    queryClient.invalidateQueries({
    queryKey: ["conversation", variables.conversationId],
  });
}

  });
  
};