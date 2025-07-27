import apiClient from "../api/axios";

// =============================================================================
// PRODUCTS/SUPPLIER LISTINGS API
// =============================================================================
// Comprehensive API for product/supplier listing management
// Includes all functions previously scattered across multiple files
// Extended with convenience functions for better developer experience
export const productsAPI = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    try {
      const response = await apiClient.get("/products", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get products by type
  getProductsByType: async (type) => {
    try {
      const response = await apiClient.get(`/products/type/${type}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by type:", error);
      throw error;
    }
  },

  // Get products by supplier
  getProductsBySupplier: async (supplierId) => {
    try {
      const response = await apiClient.get(`/products/supplier/${supplierId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by supplier:", error);
      throw error;
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post("/products", productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await apiClient.put(
        `/products/${productId}`,
        productData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await apiClient.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Get my products
  getMyProducts: async () => {
    try {
      const response = await apiClient.get("/products/user/my-products");
      return response.data;
    } catch (error) {
      console.error("Error fetching my products:", error);
      throw error;
    }
  },

  // Toggle product status
  toggleProductStatus: async (productId) => {
    try {
      const response = await apiClient.patch(
        `/products/${productId}/toggle-status`
      );
      return response.data;
    } catch (error) {
      console.error("Error toggling product status:", error);
      throw error;
    }
  },

  // Upload images
  uploadImages: async (images) => {
    try {
      const formData = new FormData();
      images.forEach((image, index) => {
        formData.append("images", image);
      });
      const response = await apiClient.post(
        "/products/upload-images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category, filters = {}) => {
    try {
      const response = await apiClient.get("/products", {
        params: { ...filters, category },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (searchQuery, filters = {}) => {
    try {
      const response = await apiClient.get("/products", {
        params: { ...filters, search: searchQuery },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  },

  // Create/Add supplier item (alias for createProduct)
  addSupplierItem: async (formData) => {
    try {
      const response = await apiClient.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding supplier item:", error);
      throw error;
    }
  },
};

export default productsAPI;
