const Notification = require("../models/Notification.model");

class NotificationService {
  constructor(notificationSocketHandler = null) {
    this.socketHandler = notificationSocketHandler;
  }

  // Set the socket handler (called after initialization)
  setSocketHandler(socketHandler) {
    this.socketHandler = socketHandler;
  }

  // Create and send notification
  async createAndSendNotification(notificationData) {
    try {
      // Create notification in database
      const notification = new Notification(notificationData);
      await notification.save();

      console.log(
        `📝 Created notification: ${notification.title} for user ${notification.userId}`
      );

      // Send real-time notification if socket handler is available
      if (this.socketHandler) {
        await this.socketHandler.sendNotificationToUser(
          notification.userId.toString(),
          notification.toObject()
        );
      }

      return notification;
    } catch (error) {
      console.error("❌ Error creating notification:", error);
      throw error;
    }
  }

  // Create notifications for multiple users
  async createAndSendBulkNotifications(userIds, notificationData) {
    try {
      const notifications = userIds.map((userId) => ({
        ...notificationData,
        userId,
      }));

      // Create all notifications in database
      const createdNotifications = await Notification.insertMany(notifications);

      console.log(
        `📝 Created ${createdNotifications.length} bulk notifications: ${notificationData.title}`
      );

      // Send real-time notifications if socket handler is available
      if (this.socketHandler) {
        await this.socketHandler.sendNotificationToUsers(
          userIds.map((id) => id.toString()),
          notificationData
        );
      }

      return createdNotifications;
    } catch (error) {
      console.error("❌ Error creating bulk notifications:", error);
      throw error;
    }
  }

  // Notification templates for different events
  async notifyOrderPlaced(buyerId, sellerId, orderData) {
    await this.createAndSendNotification({
      userId: sellerId,
      type: "order_placed",
      title: "New Order Received",
      message: `You have received a new order for ${orderData.itemName} (${orderData.quantity} ${orderData.unit})`,
      data: {
        orderId: orderData._id,
        itemName: orderData.itemName,
        quantity: orderData.quantity,
        unit: orderData.unit,
        totalPrice: orderData.totalPrice,
        buyerName: orderData.buyerName,
      },
      actionRequired: true,
      actionUrl: `/orders/${orderData._id}`,
      priority: "high",
      category: "order",
    });
  }

  async notifyOrderConfirmed(buyerId, sellerId, orderData) {
    await this.createAndSendNotification({
      userId: buyerId,
      type: "order_confirmed",
      title: "Order Confirmed",
      message: `Your order for ${orderData.itemName} has been confirmed by the seller`,
      data: {
        orderId: orderData._id,
        itemName: orderData.itemName,
        sellerName: orderData.sellerName,
      },
      actionRequired: false,
      actionUrl: `/orders/${orderData._id}`,
      priority: "medium",
      category: "order",
    });
  }

  async notifyOrderShipped(buyerId, orderData) {
    await this.createAndSendNotification({
      userId: buyerId,
      type: "order_shipped",
      title: "Order Shipped",
      message: `Your order for ${orderData.itemName} has been shipped and is on the way`,
      data: {
        orderId: orderData._id,
        itemName: orderData.itemName,
        trackingInfo: orderData.trackingInfo,
      },
      actionRequired: false,
      actionUrl: `/orders/${orderData._id}`,
      priority: "medium",
      category: "order",
    });
  }

  async notifyOrderCompleted(buyerId, sellerId, orderData) {
    // Notify buyer
    await this.createAndSendNotification({
      userId: buyerId,
      type: "order_completed",
      title: "Order Completed",
      message: `Your order for ${orderData.itemName} has been completed. Please leave a review!`,
      data: {
        orderId: orderData._id,
        itemName: orderData.itemName,
        sellerName: orderData.sellerName,
      },
      actionRequired: true,
      actionUrl: `/reviews?orderId=${orderData._id}`,
      priority: "medium",
      category: "order",
    });

    // Notify seller
    await this.createAndSendNotification({
      userId: sellerId,
      type: "order_completed",
      title: "Order Completed",
      message: `Order for ${orderData.itemName} has been marked as completed`,
      data: {
        orderId: orderData._id,
        itemName: orderData.itemName,
        buyerName: orderData.buyerName,
      },
      actionRequired: false,
      actionUrl: `/orders/${orderData._id}`,
      priority: "low",
      category: "order",
    });
  }

  async notifyOrderCancelled(buyerId, sellerId, orderData) {
    // Notify buyer
    await this.createAndSendNotification({
      userId: buyerId,
      type: "order_cancelled",
      title: "Order Cancelled",
      message: `Your order for ${orderData.itemName} has been cancelled. Reason: ${orderData.cancelReason}`,
      data: {
        orderId: orderData._id,
        itemName: orderData.itemName,
        cancelReason: orderData.cancelReason,
        cancelledBy: orderData.cancelledBy,
      },
      actionRequired: false,
      actionUrl: `/orders/${orderData._id}`,
      priority: "high",
      category: "order",
    });

    // Notify seller (if cancelled by someone else, e.g., admin)
    if (buyerId.toString() !== sellerId.toString()) {
      await this.createAndSendNotification({
        userId: sellerId,
        type: "order_cancelled",
        title: "Order Cancelled",
        message: `Order for ${orderData.itemName} has been cancelled by ${orderData.cancelledBy}`,
        data: {
          orderId: orderData._id,
          itemName: orderData.itemName,
          cancelReason: orderData.cancelReason,
          cancelledBy: orderData.cancelledBy,
        },
        actionRequired: false,
        actionUrl: `/orders/${orderData._id}`,
        priority: "medium",
        category: "order",
      });
    }
  }

  async notifyMaterialRequestResponse(buyerId, sellerId, requestData) {
    await this.createAndSendNotification({
      userId: buyerId,
      type: "material_request_response",
      title: "Material Request Response",
      message: `A seller has responded to your request for ${requestData.materialName}`,
      data: {
        requestId: requestData._id,
        materialName: requestData.materialName,
        sellerName: requestData.sellerName,
        price: requestData.price,
      },
      actionRequired: true,
      actionUrl: `/material-requests/${requestData._id}`,
      priority: "high",
      category: "material_request",
    });
  }

  async notifyMaterialRequestAccepted(sellerId, requestData) {
    await this.createAndSendNotification({
      userId: sellerId,
      type: "material_request_accepted",
      title: "Material Request Accepted",
      message: `Your response for ${requestData.materialName} has been accepted!`,
      data: {
        requestId: requestData._id,
        materialName: requestData.materialName,
        buyerName: requestData.buyerName,
      },
      actionRequired: true,
      actionUrl: `/material-requests/${requestData._id}`,
      priority: "high",
      category: "material_request",
    });
  }

  async notifySampleRequest(sellerId, sampleData) {
    await this.createAndSendNotification({
      userId: sellerId,
      type: "sample_request",
      title: "New Sample Request",
      message: `Someone has requested a sample of ${sampleData.productName}`,
      data: {
        sampleId: sampleData._id,
        productName: sampleData.productName,
        requesterName: sampleData.requesterName,
      },
      actionRequired: true,
      actionUrl: `/samples/${sampleData._id}`,
      priority: "medium",
      category: "sample",
    });
  }

  async notifySampleApproved(buyerId, sampleData) {
    await this.createAndSendNotification({
      userId: buyerId,
      type: "sample_approved",
      title: "Sample Request Approved",
      message: `Your sample request for ${sampleData.productName} has been approved`,
      data: {
        sampleId: sampleData._id,
        productName: sampleData.productName,
        sellerName: sampleData.sellerName,
      },
      actionRequired: false,
      actionUrl: `/samples/${sampleData._id}`,
      priority: "medium",
      category: "sample",
    });
  }

  async notifyReviewReceived(sellerId, reviewData) {
    await this.createAndSendNotification({
      userId: sellerId,
      type: "review_received",
      title: "New Review Received",
      message: `You received a ${reviewData.rating}-star review from ${reviewData.reviewerName}`,
      data: {
        reviewId: reviewData._id,
        rating: reviewData.rating,
        reviewerName: reviewData.reviewerName,
        productName: reviewData.productName,
      },
      actionRequired: false,
      actionUrl: `/reviews/${reviewData._id}`,
      priority: "low",
      category: "social",
    });
  }

  async notifyPaymentReceived(sellerId, paymentData) {
    await this.createAndSendNotification({
      userId: sellerId,
      type: "payment_received",
      title: "Payment Received",
      message: `You have received payment of ₹${paymentData.amount} for order ${paymentData.orderNumber}`,
      data: {
        paymentId: paymentData._id,
        amount: paymentData.amount,
        orderNumber: paymentData.orderNumber,
      },
      actionRequired: false,
      actionUrl: `/payments/${paymentData._id}`,
      priority: "medium",
      category: "payment",
    });
  }

  async notifySystemAnnouncement(message, priority = "medium", userIds = null) {
    const notificationData = {
      type: "system_announcement",
      title: "System Announcement",
      message,
      data: {},
      actionRequired: false,
      priority,
      category: "system",
    };

    if (userIds && userIds.length > 0) {
      // Send to specific users
      await this.createAndSendBulkNotifications(userIds, notificationData);
    } else {
      // Broadcast to all connected users
      if (this.socketHandler) {
        await this.socketHandler.broadcastSystemNotification(notificationData);
      }
    }
  }

  async notifyPromotion(userId, promotionData) {
    await this.createAndSendNotification({
      userId,
      type: "promotion",
      title: "Special Offer",
      message: promotionData.message,
      data: {
        promotionId: promotionData._id,
        discountPercent: promotionData.discountPercent,
        validUntil: promotionData.validUntil,
      },
      actionRequired: false,
      actionUrl: promotionData.actionUrl,
      priority: "low",
      category: "system",
      expiresAt: promotionData.validUntil,
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

module.exports = notificationService;
