import apiClient from "../api/axios";

// =============================================================================
// NEGOTIATIONS API
// =============================================================================
export const negotiationsAPI = {
  // Create negotiation
  createNegotiation: async (negotiationData) => {
    try {
      const response = await apiClient.post("/negotiations", negotiationData);
      return response.data;
    } catch (error) {
      console.error("Error creating negotiation:", error);
      throw error;
    }
  },

  // Get user's negotiations
  getUserNegotiations: async (filters = {}) => {
    try {
      const response = await apiClient.get("/negotiations/user", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user negotiations:", error);
      throw error;
    }
  },

  // Get negotiations as seller
  getSellerNegotiations: async (filters = {}) => {
    try {
      const response = await apiClient.get("/negotiations/seller", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching seller negotiations:", error);
      throw error;
    }
  },

  // Get negotiations as buyer
  getBuyerNegotiations: async (filters = {}) => {
    try {
      const response = await apiClient.get("/negotiations/buyer", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching buyer negotiations:", error);
      throw error;
    }
  },

  // Get negotiation details
  getNegotiationDetails: async (negotiationId) => {
    try {
      const response = await apiClient.get(`/negotiations/${negotiationId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching negotiation details:", error);
      throw error;
    }
  },

  // Send negotiation message
  sendNegotiationMessage: async (negotiationId, messageData) => {
    try {
      const response = await apiClient.post(
        `/negotiations/${negotiationId}/messages`,
        messageData
      );
      return response.data;
    } catch (error) {
      console.error("Error sending negotiation message:", error);
      throw error;
    }
  },

  // Get negotiation messages
  getNegotiationMessages: async (negotiationId) => {
    try {
      const response = await apiClient.get(
        `/negotiations/${negotiationId}/messages`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching negotiation messages:", error);
      throw error;
    }
  },

  // Make counter offer
  makeCounterOffer: async (negotiationId, offerData) => {
    try {
      const response = await apiClient.post(
        `/negotiations/${negotiationId}/counter-offer`,
        offerData
      );
      return response.data;
    } catch (error) {
      console.error("Error making counter offer:", error);
      throw error;
    }
  },

  // Accept negotiation offer
  acceptOffer: async (negotiationId) => {
    try {
      const response = await apiClient.post(
        `/negotiations/${negotiationId}/accept`
      );
      return response.data;
    } catch (error) {
      console.error("Error accepting offer:", error);
      throw error;
    }
  },

  // Reject negotiation offer
  rejectOffer: async (negotiationId, rejectionData) => {
    try {
      const response = await apiClient.post(
        `/negotiations/${negotiationId}/reject`,
        rejectionData
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting offer:", error);
      throw error;
    }
  },

  // Close negotiation
  closeNegotiation: async (negotiationId, closeData) => {
    try {
      const response = await apiClient.post(
        `/negotiations/${negotiationId}/close`,
        closeData
      );
      return response.data;
    } catch (error) {
      console.error("Error closing negotiation:", error);
      throw error;
    }
  },

  // Update negotiation status
  updateNegotiationStatus: async (negotiationId, statusData) => {
    try {
      const response = await apiClient.patch(
        `/negotiations/${negotiationId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating negotiation status:", error);
      throw error;
    }
  },

  // Get negotiation history
  getNegotiationHistory: async (filters = {}) => {
    try {
      const response = await apiClient.get("/negotiations/history", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching negotiation history:", error);
      throw error;
    }
  },

  // Get active negotiations
  getActiveNegotiations: async () => {
    try {
      const response = await apiClient.get("/negotiations/active");
      return response.data;
    } catch (error) {
      console.error("Error fetching active negotiations:", error);
      throw error;
    }
  },

  // Get negotiation statistics
  getNegotiationStats: async () => {
    try {
      const response = await apiClient.get("/negotiations/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching negotiation statistics:", error);
      throw error;
    }
  },

  // Upload negotiation attachments
  uploadNegotiationAttachments: async (negotiationId, formData) => {
    try {
      const response = await apiClient.post(
        `/negotiations/${negotiationId}/attachments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading negotiation attachments:", error);
      throw error;
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (negotiationId) => {
    try {
      const response = await apiClient.patch(
        `/negotiations/${negotiationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  },
};

export default negotiationsAPI;
