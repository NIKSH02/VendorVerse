import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  CheckCircle,
  Clock,
  Package,
  Truck,
  XCircle,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Eye,
  User,
} from "lucide-react";
import { useOrders } from "../context/OrderContext";
import { useOrderChat } from "../context/OrderChatContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import OrderChatButton from "../components/OrderChatButton";
import OrderChatModal from "../components/OrderChatModal";

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

const OrdersReceived = () => {
  const { user } = useAuth();
  const { sellerOrders, loading, fetchSellerOrders, updateOrderStatus } =
    useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // Refresh orders on component mount
  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

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
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getAvailableActions = (order) => {
    const actions = [];

    switch (order.status) {
      case "pending":
        actions.push(
          {
            action: "accept",
            label: "Accept Order",
            color: "bg-green-500 hover:bg-green-600",
          },
          {
            action: "cancel",
            label: "Decline",
            color: "bg-red-500 hover:bg-red-600",
          }
        );
        break;
      case "confirmed":
        actions.push(
          {
            action: "process",
            label: "Start Processing",
            color: "bg-blue-500 hover:bg-blue-600",
          },
          {
            action: "cancel",
            label: "Cancel",
            color: "bg-red-500 hover:bg-red-600",
          }
        );
        break;
      case "processing":
        actions.push(
          {
            action: "ship",
            label: "Mark as Shipped",
            color: "bg-orange-500 hover:bg-orange-600",
          },
          {
            action: "cancel",
            label: "Cancel",
            color: "bg-red-500 hover:bg-red-600",
          }
        );
        break;
      case "shipped":
        actions.push({
          action: "complete",
          label: "Mark as Complete",
          color: "bg-green-500 hover:bg-green-600",
        });
        break;
    }

    return actions;
  };

  // Exchange code modal state
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeInput, setExchangeInput] = useState("");
  const [exchangeOrderId, setExchangeOrderId] = useState(null);

  // Chat states
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedChatOrder, setSelectedChatOrder] = useState(null);

  const handleOrderAction = async (orderId, action) => {
    const actionStr = typeof action === "string" ? action : action?.action;
    // For 'complete', always open modal and do NOT call updateOrderStatus here
    if (actionStr === "complete") {
      setExchangeOrderId(orderId);
      setShowExchangeModal(true);
      return;
    }
    // Prevent accidental call with 'complete' action
    if (actionStr === "complete") return;
    try {
      setActionLoading(true);
      await updateOrderStatus(orderId, { action: actionStr, notes: "" });
      await fetchSellerOrders();
      if (showOrderDetails) {
        setShowOrderDetails(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle exchange code submit
  const handleExchangeSubmit = async () => {
    if (!exchangeInput.trim()) {
      toast.error("Please enter the exchange code.");
      return;
    }
    try {
      setActionLoading(true);
      // Ensure exchangeCode is at the root, not nested in action
      await updateOrderStatus(exchangeOrderId, {
        action: "complete",
        exchangeCode: exchangeInput.trim(),
        notes: "",
      });
      await fetchSellerOrders();
      setShowExchangeModal(false);
      setExchangeInput("");
      setExchangeOrderId(null);
      if (showOrderDetails) {
        setShowOrderDetails(false);
        setSelectedOrder(null);
      }
      toast.success("Order marked as complete!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to complete order. Please check the code and try again."
      );
    } finally {
      setActionLoading(false);
    }
  };
  {
    /* Exchange Code Modal */
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const filteredOrders = sellerOrders.filter((order) => {
    if (filterStatus === "all") return true;
    return order.status === filterStatus;
  });

  const getPendingOrdersCount = () => {
    return sellerOrders.filter((order) =>
      ["pending", "confirmed", "processing"].includes(order.status)
    ).length;
  };

  const canAcceptNewOrders = () => {
    return getPendingOrdersCount() < 3;
  };

  const handleOpenChat = (order) => {
    setSelectedChatOrder(order);
    setShowChatModal(true);
  };

  const handleCloseChat = () => {
    setShowChatModal(false);
    setSelectedChatOrder(null);
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
            Orders Received
          </motion.h1>

          {/* Order Status Limit Warning */}
          {!canAcceptNewOrders() && (
            <motion.div
              className="bg-red-50 border border-red-200 rounded-lg p-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="flex items-center text-red-700">
                <AlertCircle size={16} className="mr-2" />
                <span className="text-sm font-medium">
                  Order Limit Reached (3/3) - Complete pending orders to accept
                  new ones
                </span>
              </div>
            </motion.div>
          )}
        </div>

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
                  ({sellerOrders.filter((o) => o.status === status).length})
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
              {filterStatus !== "all" ? `with status "${filterStatus}"` : ""}
            </h3>
            <p className="text-gray-500">
              {filterStatus === "all"
                ? "You haven't received any orders yet."
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
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                {...scaleOnHover}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Quantity:</span>{" "}
                        {order.quantity} {order.unit}
                      </div>
                      <div>
                        <span className="font-medium">Buyer:</span>{" "}
                        {order.buyerId?.name || order.buyerId?.username}
                      </div>
                      <div>
                        <span className="font-medium">Order Date:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Delivery:</span>{" "}
                        {order.deliveryType}
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span>{" "}
                        {order.buyerId?.phone}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span> ₹
                        {order.totalPrice}
                      </div>
                    </div>

                    {order.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">
                          Notes:{" "}
                        </span>
                        <span className="text-sm text-gray-600">
                          {order.notes}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ₹{order.totalPrice}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg transition-colors"
                      onClick={() => viewOrderDetails(order)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </motion.button>

                    {/* Chat Button */}
                    <OrderChatButton order={order} onClick={handleOpenChat} />
                  </div>

                  <div className="flex space-x-2">
                    {getAvailableActions(order).map((actionItem) => (
                      <motion.button
                        key={actionItem.action}
                        className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${actionItem.color}`}
                        onClick={() =>
                          handleOrderAction(order._id, actionItem.action)
                        }
                        disabled={actionLoading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {actionLoading ? "Processing..." : actionItem.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {showOrderDetails && selectedOrder && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOrderDetails(false)}
            >
              <motion.div
                className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Order Details
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Info */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Order Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Order ID:</span>
                        <p className="font-medium">{selectedOrder._id}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Status:</span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ml-2 ${getStatusColor(
                            selectedOrder.status
                          )}`}
                        >
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status.charAt(0).toUpperCase() +
                            selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Item:</span>
                        <p className="font-medium">{selectedOrder.itemName}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <p className="font-medium">
                          {selectedOrder.quantity} {selectedOrder.unit}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Total Price:
                        </span>
                        <p className="font-medium text-green-600">
                          ₹{selectedOrder.totalPrice}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Delivery Type:
                        </span>
                        <p className="font-medium capitalize">
                          {selectedOrder.deliveryType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Buyer Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <User size={16} className="text-blue-500 mr-2" />
                        <div>
                          <span className="text-sm text-gray-600">Name:</span>
                          <p className="font-medium">
                            {selectedOrder.buyerId?.name ||
                              selectedOrder.buyerId?.username}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.buyerId?.phone && (
                        <div className="flex items-center">
                          <Phone size={16} className="text-blue-500 mr-2" />
                          <div>
                            <span className="text-sm text-gray-600">
                              Phone:
                            </span>
                            <p className="font-medium">
                              {selectedOrder.buyerId.phone}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.buyerId?.email && (
                        <div className="flex items-center">
                          <Mail size={16} className="text-blue-500 mr-2" />
                          <div>
                            <span className="text-sm text-gray-600">
                              Email:
                            </span>
                            <p className="font-medium">
                              {selectedOrder.buyerId.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Info */}
                  {(selectedOrder.deliveryAddress ||
                    selectedOrder.pickupAddress) && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        {selectedOrder.deliveryType === "delivery"
                          ? "Delivery"
                          : "Pickup"}{" "}
                        Address
                      </h4>
                      <div className="flex items-start">
                        <MapPin
                          size={16}
                          className="text-orange-500 mr-2 mt-1"
                        />
                        <p className="text-gray-700">
                          {selectedOrder.deliveryAddress ||
                            selectedOrder.pickupAddress}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Exchange Code - Do not show code to seller, only show info text if needed */}
                  {selectedOrder.status === "processing" && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Exchange Code Required
                      </h4>
                      <p className="text-sm text-purple-600 mt-1">
                        Buyer will provide you a code at the time of delivery or
                        pickup. Enter this code to mark the order as complete.
                      </p>
                    </div>
                  )}

                  {/* Notes */}
                  {selectedOrder.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Notes
                      </h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <motion.button
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setShowOrderDetails(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>

                    <div className="flex space-x-2">
                      {getAvailableActions(selectedOrder).map((actionItem) => (
                        <motion.button
                          key={actionItem.action}
                          className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${actionItem.color}`}
                          onClick={() => {
                            if (actionItem.action === "complete") {
                              setExchangeOrderId(selectedOrder._id);
                              setShowExchangeModal(true);
                            } else {
                              handleOrderAction(
                                selectedOrder._id,
                                actionItem.action
                              );
                            }
                          }}
                          disabled={actionLoading}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {actionLoading ? "Processing..." : actionItem.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Exchange Code Modal */}
      <AnimatePresence>
        {showExchangeModal && (
          <motion.div
            className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExchangeModal(false)}
          >
            <motion.div
              className="bg-white rounded-lg max-w-md w-full p-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Enter Exchange Code
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Please enter the exchange code provided by the buyer to mark the
                order as complete.
              </p>
              <input
                type="text"
                value={exchangeInput}
                onChange={(e) => setExchangeInput(e.target.value)}
                placeholder="Enter exchange code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setShowExchangeModal(false)}
                >
                  Cancel
                </button>
                <button
                  className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                    actionLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  onClick={handleExchangeSubmit}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Submit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Chat Modal */}
      <OrderChatModal
        orderId={selectedChatOrder?._id}
        orderData={selectedChatOrder}
        isOpen={showChatModal}
        onClose={handleCloseChat}
      />
    </DashboardLayout>
  );
};

export default OrdersReceived;
