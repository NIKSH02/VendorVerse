import apiClient from "../api/axios";

// =============================================================================
// ORDERS API
// =============================================================================
export const ordersAPI = {
  // Place order
  placeOrder: async (orderData) => {
    try {
      const response = await apiClient.post("/orders/place", orderData);
      return response.data;
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  },

  // Get buyer order history (orders placed)
  getBuyerOrderHistory: async (filters = {}) => {
    try {
      const response = await apiClient.get("/orders/buyer/history", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching buyer order history:", error);
      throw error;
    }
  },

  // Get seller orders (orders to fulfill)
  getSellerOrders: async (filters = {}) => {
    try {
      const response = await apiClient.get("/orders/seller/orders", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      throw error;
    }
  },

  // Get all user orders
  getAllUserOrders: async (filters = {}) => {
    try {
      const response = await apiClient.get("/orders/all", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw error;
    }
  },

  // Get reviewable orders
  getReviewableOrders: async () => {
    try {
      const response = await apiClient.get("/orders/reviewable");
      return response.data;
    } catch (error) {
      console.error("Error fetching reviewable orders:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await apiClient.patch(
        `/orders/${orderId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Get exchange code
  getExchangeCode: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}/exchange-code`);
      return response.data;
    } catch (error) {
      console.error("Error fetching exchange code:", error);
      throw error;
    }
  },

  // Get financial summary
  getFinancialSummary: async () => {
    try {
      const response = await apiClient.get("/orders/financial/summary");
      return response.data;
    } catch (error) {
      console.error("Error fetching financial summary:", error);
      throw error;
    }
  },

  // Get order dashboard
  getOrderDashboard: async () => {
    try {
      const response = await apiClient.get("/orders/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching order dashboard:", error);
      throw error;
    }
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },
};

export default ordersAPI;
