import { api } from ".";


export interface SendMessageRequest {
  user_id: string;
  conversationId: string;
  message: string;
}

export interface  SendMessageResponse {
    success: boolean;
    conversationId: string;
    message: string;
}

   export const chatApi = {
      async sendMessage(payload: SendMessageRequest) {
  const response = await api.post<SendMessageResponse>("/chat/ask", payload);

    return response.data;
}
   }