import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import { Eye, Star, Copy } from "lucide-react";

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
  const [ordersPlaced, setOrdersPlaced] = useState([
    {
      id: 3,
      product: "Wheat Seeds",
      quantity: "10 kg",
      supplier: "Seeds Co.",
      supplierPhone: "+91 9876543212",
      totalPrice: 1200,
      status: "shipped",
      orderDate: "2024-01-12",
      exchangeCode: "XYZ789",
    },
  ]);

  const [showExchangeCode, setShowExchangeCode] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNextAction = (order) => {
    const { status } = order;

    switch (status) {
      case "processing":
        return { action: "viewCode", label: "View Exchange Code", icon: Eye };
      case "shipped":
        return { action: "viewCode", label: "View Exchange Code", icon: Eye };
      case "completed":
        return { action: "review", label: "Add Review", icon: Star };
      default:
        return null;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Exchange code copied to clipboard!");
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
        <motion.h1
          className="text-2xl font-bold text-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Orders I Placed
        </motion.h1>

        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {ordersPlaced.map((order, index) => {
            const nextAction = getNextAction(order);
            return (
              <motion.div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                {...scaleOnHover}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {order.product}
                    </h3>
                    <p className="text-gray-600">Quantity: {order.quantity}</p>
                    <p className="text-gray-600">Supplier: {order.supplier}</p>
                    <p className="text-gray-600">
                      Phone: {order.supplierPhone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      ₹{order.totalPrice}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {order.exchangeCode && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-purple-700">
                        <strong>Your Exchange Code:</strong>{" "}
                        {order.exchangeCode}
                      </p>
                      <motion.button
                        className="text-purple-600 hover:text-purple-800"
                        onClick={() => copyToClipboard(order.exchangeCode)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy size={16} />
                      </motion.button>
                    </div>
                    <p className="text-xs text-purple-500 mt-1">
                      Share this code with seller upon delivery
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Ordered: {order.orderDate}
                  </p>
                  {nextAction && (
                    <motion.button
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                      onClick={() => {
                        if (nextAction.action === "viewCode") {
                          setSelectedOrder(order);
                          setShowExchangeCode(true);
                        } else if (nextAction.action === "review") {
                          // Navigate to reviews tab
                          console.log("Navigate to reviews");
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

        {/* Exchange Code Modal */}
        <AnimatePresence>
          {showExchangeCode && selectedOrder && (
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
                  <div className="text-3xl font-bold text-purple-600 bg-purple-50 rounded-lg p-4 mb-4">
                    {selectedOrder.exchangeCode}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Share this code with the seller when receiving your order
                  </p>

                  <motion.button
                    className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    onClick={() => copyToClipboard(selectedOrder.exchangeCode)}
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
