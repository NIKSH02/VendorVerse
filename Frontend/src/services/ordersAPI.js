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
    console.log("Updating order status:", orderId, statusData);
    let payload = { ...statusData };
    console.log("Initial Payload:", payload);
    // If action is nested inside an object, flatten all fields from action to root
    if (typeof statusData.action === "object" && statusData.action.action) {
      payload = {
        ...statusData,
        action: statusData.action.action,
      };
      // Move exchangeCode and notes (if present) to root
      if (statusData.action.exchangeCode) {
        payload.exchangeCode = statusData.action.exchangeCode;
      }
      if (statusData.action.notes) {
        payload.notes = statusData.action.notes;
      }
      console.log("Flattened Payload:", payload);
    }

    console.log("✅ Final Payload Being Sent:", payload);

    try {
      const response = await apiClient.patch(
        `/orders/${orderId}/status`,
        payload
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
