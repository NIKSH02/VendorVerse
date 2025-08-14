const mongoose = require("mongoose");

const orderChatSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        senderName: {
          type: String,
          required: true,
        },
        senderType: {
          type: String,
          enum: ["buyer", "seller"],
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      },
    ],
    lastMessage: {
      message: String,
      timestamp: Date,
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    unreadCount: {
      buyerUnread: {
        type: Number,
        default: 0,
      },
      sellerUnread: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    indexes: [
      { orderId: 1 },
      { buyerId: 1 },
      { sellerId: 1 },
      { "messages.timestamp": -1 },
    ],
  }
);

// Index for efficient querying
orderChatSchema.index({ orderId: 1 });
orderChatSchema.index({ buyerId: 1 });
orderChatSchema.index({ sellerId: 1 });

const OrderChat = mongoose.model("OrderChat", orderChatSchema);

module.exports = OrderChat;
