import React, { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";
import { Clock, Truck, CheckCircle2 } from "lucide-react";

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

const OrdersToFulfill = () => {
  const [ordersToFulfill, setOrdersToFulfill] = useState([
    {
      id: 1,
      product: "Organic Tomatoes",
      quantity: "50 kg",
      buyer: "Restaurant ABC",
      buyerPhone: "+91 9876543210",
      totalPrice: 2500,
      status: "confirmed",
      orderDate: "2024-01-15",
      deliveryType: "pickup",
      exchangeCode: null,
    },
    {
      id: 2,
      product: "Fresh Onions",
      quantity: "30 kg",
      buyer: "Hotel XYZ",
      buyerPhone: "+91 9876543211",
      totalPrice: 1800,
      status: "processing",
      orderDate: "2024-01-14",
      deliveryType: "delivery",
      deliveryAddress: "123 Main St, Mumbai",
      exchangeCode: "ABC123",
    },
  ]);

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
      case "confirmed":
        return {
          action: "processing",
          label: "Mark as Processing",
          icon: Clock,
        };
      case "processing":
        return { action: "shipped", label: "Mark as Shipped", icon: Truck };
      case "shipped":
        return {
          action: "complete",
          label: "Complete Order",
          icon: CheckCircle2,
        };
      default:
        return null;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersToFulfill((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };
          if (newStatus === "processing") {
            updatedOrder.exchangeCode = Math.random()
              .toString(36)
              .substr(2, 6)
              .toUpperCase();
          }
          return updatedOrder;
        }
        return order;
      })
    );
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
            Orders to Fulfill
          </motion.h1>
          <div className="text-sm text-gray-500">
            Limit:{" "}
            {
              ordersToFulfill.filter((o) =>
                ["pending", "confirmed", "processing", "shipped"].includes(
                  o.status
                )
              ).length
            }
            /3 pending orders
          </div>
        </div>

        <motion.div
          className="space-y-4"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {ordersToFulfill.map((order, index) => {
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
                    <p className="text-gray-600">Buyer: {order.buyer}</p>
                    <p className="text-gray-600">Phone: {order.buyerPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
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

                {order.deliveryType === "delivery" && order.deliveryAddress && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Delivery Address:</strong> {order.deliveryAddress}
                    </p>
                  </div>
                )}

                {order.exchangeCode && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">
                      <strong>Exchange Code:</strong> {order.exchangeCode}
                      <span className="text-xs text-purple-500 ml-2">
                        (Buyer has this code)
                      </span>
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Ordered: {order.orderDate}
                  </p>
                  {nextAction && (
                    <motion.button
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        nextAction.action === "complete"
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                      onClick={() => {
                        if (nextAction.action === "complete") {
                          const code = prompt(
                            "Enter exchange code from buyer:"
                          );
                          if (code === order.exchangeCode) {
                            updateOrderStatus(order.id, "complete");
                          } else {
                            alert("Invalid exchange code!");
                          }
                        } else {
                          updateOrderStatus(order.id, nextAction.action);
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
      </motion.div>
    </DashboardLayout>
  );
};

export default OrdersToFulfill;
