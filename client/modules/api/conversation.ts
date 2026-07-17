import { api } from "./index";

export const conversationApi = {
  async getAll(userId: string) {
    const response = await api.get("/conversations", {
      params: { userId },
    });

    return response.data.data;
  },

  async getById(id: string) {
    const response = await api.get(`/conversations/${id}`);

    return response.data.data;
  },

  async update(id: string, title: string) {
    const response = await api.put(`/conversations/${id}`, {
      title,
    });

    return response.data.data;
  },

  async updateTitle(id: string, title: string) {
    const response = await api.patch(`/conversations/${id}/title`, {
      title,
    });

    return response.data.data;
  },

  async delete(id: string) {
    await api.delete(`/conversations/${id}`);
  },
};