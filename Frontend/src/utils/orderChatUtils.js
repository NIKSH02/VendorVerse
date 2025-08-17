import { useNavigate } from "react-router-dom";

// Hook for navigating to order chat
export const useOrderChatNavigation = () => {
  const navigate = useNavigate();

  const goToOrderChat = (orderId) => {
    navigate(`/order-chat/${orderId}`);
  };

  return { goToOrderChat };
};

// Utility functions for order chat
export const orderChatUtils = {
  // Generate chat URL
  getChatUrl: (orderId) => `/order-chat/${orderId}`,

  // Open chat in new tab
  openChatInNewTab: (orderId) => {
    window.open(`/order-chat/${orderId}`, "_blank");
  },

  // Format message timestamp
  formatTimestamp: (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  },

  // Get chat display name
  getChatDisplayName: (orderData, currentUserId) => {
    if (!orderData) return "Unknown User";

    const isUserBuyer = orderData.buyerId?._id === currentUserId;
    const otherParty = isUserBuyer ? orderData.sellerId : orderData.buyerId;

    return otherParty?.name || otherParty?.username || "User";
  },

  // Get order status color
  getOrderStatusColor: (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
      case "shipped":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  },
};

export default orderChatUtils;
