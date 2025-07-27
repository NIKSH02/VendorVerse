// =============================================================================
// SUPPLIER SERVICE - THIN WRAPPER FOR PRODUCTS API
// =============================================================================
// This file imports and re-exports functions from productsAPI.js to maintain
// backward compatibility while avoiding code duplication.

import { productsAPI } from "./productsAPI";

// =============================================================================
// RE-EXPORTED FUNCTIONS FROM PRODUCTS API
// =============================================================================

// Core CRUD operations
export const addSupplierItem = productsAPI.addSupplierItem;
export const getAllProducts = productsAPI.getAllProducts;
export const getProductsByType = productsAPI.getProductsByType;
export const getProductsBySupplier = productsAPI.getProductsBySupplier;
export const getProductById = productsAPI.getProductById;
export const getMyProducts = productsAPI.getMyProducts;
export const updateProduct = productsAPI.updateProduct;
export const toggleProductStatus = productsAPI.toggleProductStatus;
export const deleteProduct = productsAPI.deleteProduct;
export const uploadImages = productsAPI.uploadImages;

// Convenience functions
export const getProductsByCategory = productsAPI.getProductsByCategory;
export const searchProducts = productsAPI.searchProducts;

// =============================================================================
// SUPPLIER-SPECIFIC CONVENIENCE FUNCTIONS
// =============================================================================

// Get raw products (supplier-specific filter)
export const getRawProducts = async (filters = {}) => {
  return await productsAPI.getProductsByType("raw", filters);
};

// Get half-baked products (supplier-specific filter)
export const getHalfBakedProducts = async (filters = {}) => {
  return await productsAPI.getProductsByType("half-baked", filters);
};

// Get complete products (supplier-specific filter)
export const getCompleteProducts = async (filters = {}) => {
  return await productsAPI.getProductsByType("complete", filters);
};

// Get active products only
export const getActiveProducts = async (filters = {}) => {
  return await productsAPI.getAllProducts({ ...filters, status: "active" });
};

// Get inactive products only
export const getInactiveProducts = async (filters = {}) => {
  return await productsAPI.getAllProducts({ ...filters, status: "inactive" });
};

// =============================================================================
// DEFAULT EXPORT FOR BACKWARD COMPATIBILITY
// =============================================================================
export default {
  // Core functions
  addSupplierItem,
  getAllProducts,
  getProductsByType,
  getProductsBySupplier,
  getProductById,
  getMyProducts,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
  uploadImages,
  getProductsByCategory,
  searchProducts,

  // Supplier-specific convenience functions
  getRawProducts,
  getHalfBakedProducts,
  getCompleteProducts,
  getActiveProducts,
  getInactiveProducts,
};
