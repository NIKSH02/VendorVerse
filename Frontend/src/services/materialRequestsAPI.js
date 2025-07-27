import apiClient from "../api/axios";

// =============================================================================
// MATERIAL REQUESTS API
// =============================================================================
export const materialRequestsAPI = {
  // Create material request
  createMaterialRequest: async (requestData) => {
    try {
      const response = await apiClient.post("/material-requests", requestData);
      return response.data;
    } catch (error) {
      console.error("Error creating material request:", error);
      throw error;
    }
  },

  // Get user's material requests
  getUserMaterialRequests: async (filters = {}) => {
    try {
      const response = await apiClient.get("/material-requests/user", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user material requests:", error);
      throw error;
    }
  },

  // Get all material requests (for suppliers)
  getAllMaterialRequests: async (filters = {}) => {
    try {
      const response = await apiClient.get("/material-requests", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all material requests:", error);
      throw error;
    }
  },

  // Get material request details
  getMaterialRequestDetails: async (requestId) => {
    try {
      const response = await apiClient.get(`/material-requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching material request details:", error);
      throw error;
    }
  },

  // Update material request
  updateMaterialRequest: async (requestId, requestData) => {
    try {
      const response = await apiClient.put(
        `/material-requests/${requestId}`,
        requestData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating material request:", error);
      throw error;
    }
  },

  // Delete material request
  deleteMaterialRequest: async (requestId) => {
    try {
      const response = await apiClient.delete(
        `/material-requests/${requestId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting material request:", error);
      throw error;
    }
  },

  // Accept material request
  acceptMaterialRequest: async (requestId, acceptanceData) => {
    try {
      const response = await apiClient.post(
        `/material-requests/${requestId}/accept`,
        acceptanceData
      );
      return response.data;
    } catch (error) {
      console.error("Error accepting material request:", error);
      throw error;
    }
  },

  // Reject material request
  rejectMaterialRequest: async (requestId, rejectionData) => {
    try {
      const response = await apiClient.post(
        `/material-requests/${requestId}/reject`,
        rejectionData
      );
      return response.data;
    } catch (error) {
      console.error("Error rejecting material request:", error);
      throw error;
    }
  },

  // Get material request acceptances
  getMaterialRequestAcceptances: async (requestId) => {
    try {
      const response = await apiClient.get(
        `/material-requests/${requestId}/acceptances`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching material request acceptances:", error);
      throw error;
    }
  },

  // Update acceptance status
  updateAcceptanceStatus: async (acceptanceId, statusData) => {
    try {
      const response = await apiClient.patch(
        `/material-requests/acceptances/${acceptanceId}`,
        statusData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating acceptance status:", error);
      throw error;
    }
  },

  // Search material requests
  searchMaterialRequests: async (searchParams) => {
    try {
      const response = await apiClient.get("/material-requests/search", {
        params: searchParams,
      });
      return response.data;
    } catch (error) {
      console.error("Error searching material requests:", error);
      throw error;
    }
  },

  // Get material request categories
  getMaterialRequestCategories: async () => {
    try {
      const response = await apiClient.get("/material-requests/categories");
      return response.data;
    } catch (error) {
      console.error("Error fetching material request categories:", error);
      throw error;
    }
  },

  // Get material request statistics
  getMaterialRequestStats: async () => {
    try {
      const response = await apiClient.get("/material-requests/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching material request statistics:", error);
      throw error;
    }
  },

  // Upload material request documents
  uploadMaterialRequestDocuments: async (requestId, formData) => {
    try {
      const response = await apiClient.post(
        `/material-requests/${requestId}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading material request documents:", error);
      throw error;
    }
  },

  // Get trending material requests
  getTrendingMaterialRequests: async (filters = {}) => {
    try {
      const response = await apiClient.get("/material-requests/trending", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching trending material requests:", error);
      throw error;
    }
  },
};

export default materialRequestsAPI;
