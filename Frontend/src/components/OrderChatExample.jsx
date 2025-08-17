import React, { useState } from "react";
import { MessageCircle, ExternalLink } from "lucide-react";
import OrderChatModal from "../components/OrderChatModal";
import OrderChatSidebar from "../components/OrderChatSidebar";
import { useOrderChatNavigation } from "../utils/orderChatUtils";

const OrderChatExample = ({ orderId, orderData }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { goToOrderChat } = useOrderChatNavigation();

  return (
    <div className="flex items-center space-x-2">
      {/* Option 1: Small Modal (existing) */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm"
        title="Open chat modal"
      >
        <MessageCircle size={16} />
        <span>Chat (Modal)</span>
      </button>

      {/* Option 2: Full Screen Page */}
      <button
        onClick={() => goToOrderChat(orderId)}
        className="flex items-center space-x-2 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors text-sm"
        title="Open chat in full screen"
      >
        <ExternalLink size={16} />
        <span>Chat (Full Screen)</span>
      </button>

      {/* Option 3: Professional Sidebar */}
      <button
        onClick={() => setShowSidebar(true)}
        className="flex items-center space-x-2 px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors text-sm"
        title="Open chat sidebar"
      >
        <MessageCircle size={16} />
        <span>Chat (Sidebar)</span>
      </button>

      {/* Render Components */}
      <OrderChatModal
        orderId={orderId}
        orderData={orderData}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <OrderChatSidebar
        orderId={orderId}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
    </div>
  );
};

export default OrderChatExample;
