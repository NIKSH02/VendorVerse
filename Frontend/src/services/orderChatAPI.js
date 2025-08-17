import apiClient from "../api/axios";

// =============================================================================
// ORDER CHAT API
// =============================================================================
export const orderChatAPI = {
  // Get or create chat for an order
  getOrCreateOrderChat: async (orderId) => {
    try {
      const response = await apiClient.get(`/order-chat/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting order chat:", error);
      throw error;
    }
  },

  // Get messages for an order chat
  getOrderChatMessages: async (orderId, page = 1, limit = 50) => {
    try {
      const response = await apiClient.get(
        `/order-chat/order/${orderId}/messages`,
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting order chat messages:", error);
      throw error;
    }
  },

  // Get all chats for current user
  getUserOrderChats: async (page = 1, limit = 20) => {
    try {
      const response = await apiClient.get("/order-chat", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting user order chats:", error);
      throw error;
    }
  },

  // Send message in order chat (REST API fallback)
  sendOrderChatMessage: async (orderId, message) => {
    try {
      const response = await apiClient.post(
        `/order-chat/order/${orderId}/message`,
        {
          message,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending order chat message:", error);
      throw error;
    }
  },
};

export default orderChatAPI;
