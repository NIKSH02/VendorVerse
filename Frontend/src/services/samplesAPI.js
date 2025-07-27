import apiClient from "../api/axios";

// =============================================================================
// SAMPLES API
// =============================================================================
export const samplesAPI = {
  // Request sample
  requestSample: async (sampleData) => {
    try {
      const response = await apiClient.post("/samples/request", sampleData);
      return response.data;
    } catch (error) {
      console.error("Error requesting sample:", error);
      throw error;
    }
  },

  // Get user's sample requests
  getUserSampleRequests: async (filters = {}) => {
    try {
      const response = await apiClient.get("/samples/user-requests", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user sample requests:", error);
      throw error;
    }
  },

  // Get sample requests for seller
  getSellerSampleRequests: async (filters = {}) => {
    try {
      const response = await apiClient.get("/samples/seller-requests", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching seller sample requests:", error);
      throw error;
    }
  },

  // Update sample request status
  updateSampleStatus: async (sampleId, statusData) => {
    try {
      const response = await apiClient.patch(
        `/samples/${sampleId}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating sample status:", error);
      throw error;
    }
  },

  // Accept sample request
  acceptSampleRequest: async (sampleId, acceptanceData) => {
    try {
      const response = await apiClient.post(
        `/samples/${sampleId}/accept`,
        acceptanceData
      );
      return response.data;
    } catch (error) {
      console.error("Error accepting sample request:", error);
      throw error;
    }
  },

  // Reject sample request
  rejectSampleRequest: async (sampleId, rejectionData) => {
    try {
      const response = await apiClient.post(
        `/samples/${sampleId}/reject`,
        rejectionData
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting sample request:", error);
      throw error;
    }
  },

  // Get sample details
  getSampleDetails: async (sampleId) => {
    try {
      const response = await apiClient.get(`/samples/${sampleId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching sample details:", error);
      throw error;
    }
  },

  // Update sample delivery status
  updateDeliveryStatus: async (sampleId, deliveryData) => {
    try {
      const response = await apiClient.patch(
        `/samples/${sampleId}/delivery`,
        deliveryData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating delivery status:", error);
      throw error;
    }
  },

  // Track sample shipment
  trackSampleShipment: async (sampleId) => {
    try {
      const response = await apiClient.get(`/samples/${sampleId}/tracking`);
      return response.data;
    } catch (error) {
      console.error("Error tracking sample shipment:", error);
      throw error;
    }
  },

  // Get sample history
  getSampleHistory: async (filters = {}) => {
    try {
      const response = await apiClient.get("/samples/history", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sample history:", error);
      throw error;
    }
  },

  // Upload sample images
  uploadSampleImages: async (sampleId, formData) => {
    try {
      const response = await apiClient.post(
        `/samples/${sampleId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading sample images:", error);
      throw error;
    }
  },

  // Get sample metrics
  getSampleMetrics: async () => {
    try {
      const response = await apiClient.get("/samples/metrics");
      return response.data;
    } catch (error) {
      console.error("Error fetching sample metrics:", error);
      throw error;
    }
  },
};

export default samplesAPI;
