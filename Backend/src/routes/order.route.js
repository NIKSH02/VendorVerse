const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getBuyerOrderHistory,
  getSellerOrders,
  updateOrderStatus,
  cancelOrderByBuyer,
  provideExchangeCode,
  getOrderDetails,
  getOrderDashboard,
  getAllUserOrders,
  getReviewableOrders,
  getUserFinancialSummary,
} = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");

// All routes require authentication
router.use(auth);

// Order management routes
router.post("/place", placeOrder); // Place an order
router.get("/buyer/history", getBuyerOrderHistory); // Get buyer's order history (orders placed)
router.get("/seller/orders", getSellerOrders); // Get seller's incoming orders (orders to fulfill)
router.get("/all", getAllUserOrders); // Get all orders for user (both buyer & seller)
router.get("/reviewable", getReviewableOrders); // Get orders that can be reviewed
router.patch("/:orderId/status", updateOrderStatus); // Update order status (seller: accept, process, ship, complete, cancel)
router.patch("/:orderId/cancel", cancelOrderByBuyer); // Cancel order (buyer only)
router.get("/:orderId/exchange-code", provideExchangeCode); // Get exchange code (buyer)
router.get("/financial/summary", getUserFinancialSummary); // Get financial summary for profile
router.get("/dashboard", getOrderDashboard); // Get order dashboard/summary
router.get("/:orderId", getOrderDetails); // Get order details

module.exports = router;
