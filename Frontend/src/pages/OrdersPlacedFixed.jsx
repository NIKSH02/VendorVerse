import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Eye,
  Star,
  Copy,
  Package,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

const scaleOnHover = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

const OrdersPlaced = () => {
  const navigate = useNavigate();
  const {
    buyerOrders,
    reviewableOrders,
    loading,
    fetchBuyerOrders,
    fetchReviewableOrders,
    getExchangeCode,
  } = useOrders();

  const [showExchangeCode, setShowExchangeCode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [exchangeCodeData, setExchangeCodeData] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch orders on component mount
  useEffect(() => {
    fetchBuyerOrders();
    fetchReviewableOrders();
  }, [fetchBuyerOrders, fetchReviewableOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "confirmed":
        return <CheckCircle size={16} />;
      case "processing":
        return <Package size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getNextAction = (order) => {
    const { status } = order;

    switch (status) {
      case "processing":
      case "shipped":
        return { action: "viewCode", label: "View Exchange Code", icon: Eye };
      case "completed":
        // Check if this order is in reviewable orders
        const isReviewable = reviewableOrders.some(
          (ro) => ro._id === order._id
        );
        if (isReviewable) {
          return { action: "review", label: "Add Review", icon: Star };
        }
        return null;
      default:
        return null;
    }
  };

  const handleGetExchangeCode = async (order) => {
    try {
      const response = await getExchangeCode(order._id);
      setExchangeCodeData(response);
      setSelectedOrder(order);
      setShowExchangeCode(true);
    } catch (error) {
      console.error("Error fetching exchange code:", error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Exchange code copied to clipboard!");
  };

  const handleNavigateToReviews = () => {
    navigate("/dashboard/reviews");
  };

  const filteredOrders = buyerOrders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Orders I Placed
        </motion.h1>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          {[
            "all",
            "pending",
            "confirmed",
            "processing",
            "shipped",
            "completed",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                filterStatus === status
                  ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && (
                <span className="ml-1 text-xs">
                  ({buyerOrders.filter((o) => o.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No orders{" "}
              {filterStatus !== "all" ? `with status "${filterStatus}"` : ""}{" "}
              found
            </h3>
            <p className="text-gray-500">
              {filterStatus === "all"
                ? "You haven't placed any orders yet."
                : `No orders found with "${filterStatus}" status.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {filteredOrders.map((order, index) => {
              const nextAction = getNextAction(order);
              return (
                <motion.div
                  key={order._id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                  {...scaleOnHover}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {order.itemName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          Quantity: {order.quantity} {order.unit}
                        </p>
                        <p>
                          Supplier:{" "}
                          {order.sellerId?.name || order.sellerId?.username}
                        </p>
                        <p>Phone: {order.sellerId?.phone}</p>
                        <p>Delivery: {order.deliveryType}</p>
                        {order.expectedDeliveryDate && (
                          <p>
                            Expected:{" "}
                            {new Date(
                              order.expectedDeliveryDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        ₹{order.totalPrice}
                      </p>
                    </div>
                  </div>

                  {/* Exchange Code Display */}
                  {(order.status === "processing" ||
                    order.status === "shipped") && (
                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-purple-700">
                          <strong>Exchange Code Available</strong>
                        </p>
                        <motion.button
                          className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          onClick={() => handleGetExchangeCode(order)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View Code
                        </motion.button>
                      </div>
                      <p className="text-xs text-purple-500 mt-1">
                        Share this code with seller upon delivery/pickup
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Ordered: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {nextAction && (
                      <motion.button
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                        onClick={() => {
                          if (nextAction.action === "viewCode") {
                            handleGetExchangeCode(order);
                          } else if (nextAction.action === "review") {
                            handleNavigateToReviews();
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <nextAction.icon size={16} />
                        <span>{nextAction.label}</span>
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Exchange Code Modal */}
        <AnimatePresence>
          {showExchangeCode && selectedOrder && exchangeCodeData && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Exchange Code
                </h3>

                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-purple-600 bg-purple-50 rounded-lg p-4 mb-4 font-mono">
                    {exchangeCodeData.exchangeCode}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Share this code with the seller when receiving your order
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Order Details:
                    </h4>
                    <p className="text-sm text-gray-600">
                      Order ID: {selectedOrder._id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Item: {selectedOrder.itemName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {selectedOrder.quantity} {selectedOrder.unit}
                    </p>
                    <p className="text-sm text-gray-600">
                      Seller: {selectedOrder.sellerId?.name}
                    </p>
                  </div>

                  <motion.button
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mb-2"
                    onClick={() =>
                      copyToClipboard(exchangeCodeData.exchangeCode)
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Copy Code
                  </motion.button>
                </div>

                <motion.button
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setShowExchangeCode(false);
                    setSelectedOrder(null);
                    setExchangeCodeData(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
};

export default OrdersPlaced;
