import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Phone, MoreVertical, Smile, Paperclip, Search, Menu, X } from 'lucide-react';

const PersonalChatUI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: "other",
      content: "Hi! Thanks for your interest in bulk rice. We have premium quality basmati available.",
      timestamp: "2:15 PM",
      buttons: ["View Rice Options", "Get Quote"]
    },
    {
      id: 2,
      senderId: "me",
      content: "I need 50kg basmati rice for my restaurant. What's your best price?",
      timestamp: "2:17 PM"
    },
    {
      id: 3,
      senderId: "other",
      content: "For 50kg premium basmati, I can offer ₹3,200. Free delivery within 5km.",
      timestamp: "2:18 PM",
      buttons: ["Accept Offer", "Negotiate"]
    },
    {
      id: 4,
      senderId: "me",
      content: "Sounds good! Can you deliver tomorrow morning?",
      timestamp: "2:20 PM"
    },
    {
      id: 5,
      senderId: "other",
      content: "Yes, I can deliver between 8-10 AM. I'll confirm the exact time tonight.",
      timestamp: "2:22 PM"
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Mock chat list data
  const chatList = [
    {
      id: 1,
      name: "Raj Spices & Supplies",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Yes, I can deliver between 8-10 AM. I'll confirm the exact time tonight.",
      timestamp: "2:22 PM",
      unreadCount: 0,
      isOnline: true,
      category: "Spices & Grains"
    },
    {
      id: 2,
      name: "Fresh Farm Vegetables",
      avatar: "/api/placeholder/40/40",
      lastMessage: "We have fresh tomatoes, onions, and potatoes available. Interested?",
      timestamp: "1:45 PM",
      unreadCount: 2,
      isOnline: true,
      category: "Vegetables"
    },
    {
      id: 3,
      name: "Dairy Pure Co.",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Thanks for the order! Will deliver milk and cheese tomorrow.",
      timestamp: "Yesterday",
      unreadCount: 0,
      isOnline: false,
      category: "Dairy"
    },
    {
      id: 4,
      name: "Ocean Fresh Seafood",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Fresh catch arrived today. Check our latest offerings.",
      timestamp: "Yesterday",
      unreadCount: 1,
      isOnline: false,
      category: "Seafood"
    },
    {
      id: 5,
      name: "Organic Fruits Direct",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Seasonal mangoes are in stock now!",
      timestamp: "2 days ago",
      unreadCount: 0,
      isOnline: true,
      category: "Fruits"
    },
    {
      id: 6,
      name: "Premium Meat House",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Your chicken order is ready for pickup.",
      timestamp: "2 days ago",
      unreadCount: 0,
      isOnline: false,
      category: "Meat"
    }
  ];

  const currentUser = "me";
  const activeUserData = chatList.find(chat => chat.id === activeChat);

  const filteredChats = chatList.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: currentUser,
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleButtonClick = (buttonText, messageId) => {
    const message = {
      id: messages.length + 1,
      senderId: currentUser,
      content: buttonText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, message]);
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    setIsSidebarOpen(false);
    // In a real app, you'd load messages for this chat
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:relative z-30 w-80 bg-white border-r border-gray-200 h-full transition-transform duration-300 ease-in-out flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <div className="flex items-center space-x-1">
                {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span className={`text-xs font-medium ${getConnectionStatusColor()}`}>
                  {getConnectionStatusText()}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                activeChat === chat.id ? 'bg-orange-50 border-r-2 border-r-orange-400' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full bg-gray-300"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      {chat.unreadCount > 0 && (
                        <span className="bg-orange-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 truncate mb-1">{chat.lastMessage}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      {chat.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      {chat.isOnline && (
                        <span className="text-xs text-green-500 font-medium">Online</span>
                      )}
                      {!chat.isOnline && (
                        <span className="text-xs text-gray-400">Offline</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredChats.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Search size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500 text-sm">No conversations found</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {chatListWithStatus.filter(c => c.isOnline).length} suppliers online
            </p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className={`text-xs ${getConnectionStatusColor()}`}>
                {isConnected ? 'Real-time sync active' : 'Connection lost'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            
            <div className="relative">
              <img
                src={activeUserData?.avatar}
                alt={activeUserData?.name}
                className="w-10 h-10 rounded-full bg-gray-300"
              />
              {activeUserData?.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">{activeUserData?.name}</h3>
              <div className="flex items-center space-x-2">
                <p className="text-xs md:text-sm text-green-600 font-medium">
                  {activeUserData?.isOnline ? 'Online now' : 'Last seen 2 hrs ago'}
                </p>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{activeUserData?.category}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full hidden md:flex">
              <Phone size={18} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs md:max-w-md lg:max-w-lg`}>
                {message.senderId !== currentUser && (
                  <div className="flex items-start space-x-2">
                    <img
                      src={activeUserData?.avatar}
                      alt={activeUserData?.name}
                      className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                        <p className="text-gray-800 text-sm leading-relaxed">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-2">{message.timestamp}</p>
                      
                      {/* Action Buttons */}
                      {message.buttons && (
                        <div className="flex flex-wrap gap-2 mt-3 ml-2">
                          {message.buttons.map((button, index) => (
                            <button
                              key={index}
                              onClick={() => handleButtonClick(button, message.id)}
                              className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                                index === 0
                                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 border border-orange-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                              }`}
                            >
                              {button}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {message.senderId === currentUser && (
                  <div className="flex justify-end">
                    <div className="bg-orange-400 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-sm">
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                )}
                
                {message.senderId === currentUser && (
                  <p className="text-xs text-gray-500 mt-1 text-right mr-2">{message.timestamp}</p>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <img
                  src={activeUserData?.avatar}
                  alt={activeUserData?.name}
                  className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"
                />
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Action Buttons */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex justify-center space-x-4 mb-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors border border-orange-200">
              <span>₹</span>
              <span>Request Quote</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200">
              <span>📅</span>
              <span>Schedule Delivery</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium hover:bg-green-100 transition-colors border border-green-200">
              <span>🛒</span>
              <span>Place Order</span>
            </button>
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-end space-x-3">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Paperclip size={20} />
            </button>
            
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                disabled={!isConnected}
                className="w-full px-4 py-3 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-colors min-h-[44px] max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
                rows={1}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Smile size={18} />
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              className="p-3 bg-orange-400 text-white rounded-full hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalChatUI;