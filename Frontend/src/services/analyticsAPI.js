import apiClient from "../api/axios";

// =============================================================================
// ANALYTICS API
// =============================================================================
export const analyticsAPI = {
  // Get user analytics dashboard
  getUserAnalytics: async (timeRange = "30d") => {
    try {
      const response = await apiClient.get("/analytics/user", {
        params: { timeRange },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      throw error;
    }
  },

  // Get sales analytics
  getSalesAnalytics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/sales", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sales analytics:", error);
      throw error;
    }
  },

  // Get order analytics
  getOrderAnalytics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/orders", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching order analytics:", error);
      throw error;
    }
  },

  // Get product performance analytics
  getProductAnalytics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/products", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching product analytics:", error);
      throw error;
    }
  },

  // Get revenue analytics
  getRevenueAnalytics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/revenue", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      throw error;
    }
  },

  // Get customer analytics
  getCustomerAnalytics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/customers", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
      throw error;
    }
  },

  // Get market trends
  getMarketTrends: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/market-trends", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching market trends:", error);
      throw error;
    }
  },

  // Get category performance
  getCategoryPerformance: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/categories", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching category performance:", error);
      throw error;
    }
  },

  // Get geographical analytics
  getGeographicalAnalytics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/geographical", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching geographical analytics:", error);
      throw error;
    }
  },

  // Get time-based analytics
  getTimeBasedAnalytics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/time-based", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching time-based analytics:", error);
      throw error;
    }
  },

  // Get comparison analytics
  getComparisonAnalytics: async (compareData) => {
    try {
      const response = await apiClient.post("/analytics/compare", compareData);
      return response.data;
    } catch (error) {
      console.error("Error fetching comparison analytics:", error);
      throw error;
    }
  },

  // Get forecasting data
  getForecastingData: async (forecastParams) => {
    try {
      const response = await apiClient.get("/analytics/forecast", {
        params: forecastParams,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching forecasting data:", error);
      throw error;
    }
  },

  // Get real-time metrics
  getRealTimeMetrics: async () => {
    try {
      const response = await apiClient.get("/analytics/real-time");
      return response.data;
    } catch (error) {
      console.error("Error fetching real-time metrics:", error);
      throw error;
    }
  },

  // Get performance indicators
  getPerformanceIndicators: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/kpi", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching performance indicators:", error);
      throw error;
    }
  },

  // Get custom reports
  getCustomReport: async (reportConfig) => {
    try {
      const response = await apiClient.post(
        "/analytics/custom-report",
        reportConfig
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching custom report:", error);
      throw error;
    }
  },

  // Export analytics data
  exportAnalyticsData: async (exportConfig) => {
    try {
      const response = await apiClient.post("/analytics/export", exportConfig, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error exporting analytics data:", error);
      throw error;
    }
  },

  // Get engagement metrics
  getEngagementMetrics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/engagement", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching engagement metrics:", error);
      throw error;
    }
  },

  // Get conversion analytics
  getConversionAnalytics: async (filters = {}) => {
    try {
      const response = await apiClient.get("/analytics/conversion", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching conversion analytics:", error);
      throw error;
    }
  },
};

export default analyticsAPI;
