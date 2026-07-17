import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationApi } from "@/modules/api/conversation";

export function useConversations(userId: string) {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => conversationApi.getAll(userId),
    enabled: !!userId,
  });
}

export function useConversation(id: string | null) {

  return useQuery({

    queryKey: ["conversation", id],

    queryFn: () => conversationApi.getById(id!),

    enabled: !!id,

  });

}


export function useConversationMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["conversations"],
    });

  const update = useMutation({
    mutationFn: (variables: { id: any; title: string }) =>
      conversationApi.updateTitle(variables.id, variables.title),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: any) => conversationApi.delete(id),
    onSuccess: invalidate,
  });

  return {
    update,
    remove,
  };
}