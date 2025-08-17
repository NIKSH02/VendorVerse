const express = require("express");
const {
  getOrCreateOrderChat,
  getOrderChatMessages,
  getUserOrderChats,
  sendOrderChatMessage,
} = require("../controllers/orderChat.controller.js");
const auth = require("../middlewares/auth.middleware.js");

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all chats for current user
router.get("/", getUserOrderChats);

// Get or create chat for specific order
router.get("/order/:orderId", getOrCreateOrderChat);

// Get messages for specific order chat
router.get("/order/:orderId/messages", getOrderChatMessages);

// Send message in order chat (REST API fallback)
router.post("/order/:orderId/message", sendOrderChatMessage);

module.exports = router;
