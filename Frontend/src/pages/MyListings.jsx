import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import ProductDetailModal from "../components/ProductDetailModal";
import { productsAPI } from "../services/productsAPI";
import {
  Package,
  CheckCircle2,
  Eye,
  MessageSquare,
  Plus,
  Edit3,
  Trash2,
  Search,
  Store,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const MyListings = () => {
  const navigate = useNavigate();

  // State management
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Fetch user's products from backend
  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productsAPI.getMyProducts();

      if (response.success) {
        // Transform backend data to match component expectations
        const transformedProducts = response.data.map((product) => ({
          id: product._id,
          name: product.itemName,
          category: product.category,
          price: product.pricePerUnit,
          unit: product.unit,
          stock: product.quantityAvailable,
          description: product.description,
          image:
            product.imageUrl ||
            product.imageUrls?.[0] ||
            "/api/placeholder/150/150",
          status: product.isActive ? "active" : "inactive",
          type: product.type,
          location: product.location,
          deliveryAvailable: product.deliveryAvailable,
          deliveryFee: product.deliveryFee,
          dateAdded: new Date(product.createdAt).toLocaleDateString(),
          views: 0, // Backend doesn't track views yet
          inquiries: 0, // Backend doesn't track inquiries yet
          userId: product.userId,
        }));

        setMyListings(transformedProducts);
        setPagination(
          response.pagination || {
            current: 1,
            pages: 1,
            total: transformedProducts.length,
          }
        );
      } else {
        throw new Error(response.message || "Failed to fetch products");
      }
    } catch (err) {
      console.error("Error fetching products:", err);

      // Handle authentication errors
      if (err.response && err.response.status === 401) {
        toast.error("Session expired. Please login again.");
        setTimeout(() => navigate("/auth"), 2000);
        return;
      }

      setError(
        err.message || "Failed to load your products. Please try again."
      );
      toast.error("Failed to load your products");
    } finally {
      setLoading(false);
    }
  };

  // Function to open product detail modal
  const handleViewDetails = (product) => {
    console.log("View Details clicked for product:", product);
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
    console.log("Modal state set - isDetailModalOpen:", true);
  };

  // Function to close product detail modal
  const handleCloseDetailModal = () => {
    setSelectedProduct(null);
    setIsDetailModalOpen(false);
  };

  // Delete product function
  const handleDeleteProduct = async (productId, productName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const loadingToast = toast.loading("Deleting product...");

      const response = await productsAPI.deleteProduct(productId);

      if (response.success) {
        toast.dismiss(loadingToast);
        toast.success("Product deleted successfully!");

        // Remove product from local state
        setMyListings((prev) =>
          prev.filter((product) => product.id !== productId)
        );
      } else {
        throw new Error(response.message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  // Toggle product status function
  const handleToggleStatus = async (productId, productName, currentStatus) => {
    try {
      const loadingToast = toast.loading(
        `${
          currentStatus === "active" ? "Deactivating" : "Activating"
        } product...`
      );

      const response = await productsAPI.toggleProductStatus(productId);

      if (response.success) {
        toast.dismiss(loadingToast);
        toast.success(
          `Product ${
            currentStatus === "active" ? "deactivated" : "activated"
          } successfully!`
        );

        // Update product status in local state
        setMyListings((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  status: currentStatus === "active" ? "inactive" : "active",
                }
              : product
          )
        );
      } else {
        throw new Error(response.message || "Failed to update product status");
      }
    } catch (err) {
      console.error("Error toggling product status:", err);
      toast.error("Failed to update product status. Please try again.");
    }
  };

  // Load products on component mount
  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Retry function for error state
  const handleRetry = () => {
    fetchMyProducts();
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <motion.h1
            className="text-2xl font-bold text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            My Listings
          </motion.h1>

          <div className="flex items-center space-x-3">
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard/add-product")}
            >
              <Plus size={20} />
              <span>Add New Product</span>
            </motion.button>

            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetry}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex items-center justify-center py-16"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your products...</p>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            className="flex flex-col items-center justify-center py-16"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Oops! Something went wrong
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">{error}</p>
              <motion.button
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
              >
                Try Again
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* No Products State */}
        {!loading && !error && myListings.length === 0 && (
          <motion.div
            className="text-center py-16"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Store size={48} className="text-orange-500" />
            </motion.div>

            <motion.h3
              className="text-xl font-semibold text-gray-800 mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              No Products Listed Yet
            </motion.h3>

            <motion.p
              className="text-gray-600 mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Start selling your products on RawConnect! List your items, manage
              inventory, and reach thousands of potential buyers.
            </motion.p>

            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(251, 146, 60, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => navigate("/dashboard/add-product")}
            >
              <span className="flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Your First Product</span>
              </span>
            </motion.button>
          </motion.div>
        )}

        {/* Products List with Stats */}
        {!loading && !error && myListings.length > 0 && (
          <>
            {/* Summary Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-4"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {myListings.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package size={20} className="text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-4"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Listings</p>
                    <p className="text-2xl font-bold text-green-600">
                      {
                        myListings.filter((item) => item.status === "active")
                          .length
                      }
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 size={20} className="text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-4"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Stock</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {myListings.reduce(
                        (sum, item) => sum + (item.stock || 0),
                        0
                      )}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Eye size={20} className="text-purple-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-white border border-gray-200 rounded-lg p-4"
                variants={fadeInUp}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Product Types</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {new Set(myListings.map((item) => item.type)).size}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MessageSquare size={20} className="text-orange-600" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Products Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {myListings.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Product Image */}
                  <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {product.image &&
                    product.image !== "/api/placeholder/150/150" ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>

                    {/* Product Type Badge */}
                    {product.type && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full capitalize">
                          {product.type}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Product Header */}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Category and Price */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500 capitalize">
                        {product.category || "Uncategorized"}
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        ₹{product.price}/{product.unit}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description || "No description available"}
                    </p>

                    {/* Stats */}
                    <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
                      <span>
                        Stock: {product.stock} {product.unit}
                      </span>
                      <span>Added: {product.dateAdded}</span>
                      {product.deliveryAvailable && (
                        <span className="text-green-600">🚚 Delivery</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      {/* First row - View Details */}
                      <motion.button
                        className="w-full flex items-center justify-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleViewDetails(product)}
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </motion.button>

                      {/* Second row - Edit, Status, Delete */}
                      <div className="flex space-x-2">
                        <motion.button
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            navigate(`/dashboard/edit-product/${product.id}`)
                          }
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </motion.button>

                        <motion.button
                          className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                            product.status === "active"
                              ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                              : "bg-green-500 hover:bg-green-600 text-white"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handleToggleStatus(
                              product.id,
                              product.name,
                              product.status
                            )
                          }
                        >
                          <CheckCircle2 size={14} />
                          <span>
                            {product.status === "active" ? "Disable" : "Enable"}
                          </span>
                        </motion.button>

                        <motion.button
                          className="flex items-center justify-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handleDeleteProduct(product.id, product.name)
                          }
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* Toast Notifications */}
        <Toaster />

        {/* Product Detail Modal */}
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          product={selectedProduct}
        />
      </motion.div>
    </DashboardLayout>
  );
};

export default MyListings;
