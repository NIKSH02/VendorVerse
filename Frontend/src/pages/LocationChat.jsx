import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import SideBar from '../components/SideBar';

const LocationChat = () => {
  const { user, isAuthenticated } = useAuth();

  console.log('user in location chat : ' , JSON.stringify(user));
  console.log("isauth in location chat. " , isAuthenticated);
  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const normalizedLocation = (user.address?.city || 'Unknown Location').trim().toLowerCase();
  const currentUser = {
    userId: user._id,
    userName: user.name,
    location: (user.address?.city || 'Unknown Location').trim().toLowerCase()
  };

  // State management
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Refs
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    const serverUrl ='https://vendorverse-uzqz.onrender.com';
    
    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError(null);
      
      // Join location-based room
      socket.emit('joinLocation', {
        userId: currentUser.userId,
        userName: currentUser.userName,
        location: currentUser.location
      });
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setError('Failed to connect to chat server');
      setIsConnected(false);
    });

    // Chat event handlers
    socket.on('receiveMessage', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    socket.on('userJoined', (data) => {
      console.log(`${data.userName} joined the chat`);
    });

    socket.on('userLeft', (data) => {
      console.log(`${data.userName} left the chat`);
    });

    socket.on('activeUsersCount', (data) => {
      setActiveUsers(data.activeCount);
    });

    socket.on('activeUsersUpdate', (data) => {
      setActiveUsers(data.activeCount);
    });

    socket.on('userTyping', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => {
          if (!prev.find(user => user.userId === data.userId)) {
            return [...prev, { userId: data.userId, userName: data.userName }];
          }
          return prev;
        });
      } else {
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setError(error.message);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.emit('leaveLocation', {
          userId: currentUser.userId,
          location: currentUser.location
        });
        socket.disconnect();
      }
    };
  }, [currentUser.userId, currentUser.userName, currentUser.location]);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        const serverUrl = 'https://vendorverse-uzqz.onrender.com';
        const response = await fetch(`${serverUrl}/api/messages/${encodeURIComponent(currentUser.location)}/recent`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(data.data.messages);
          }
        } else {
          console.error('Failed to load chat history');
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        setError('Failed to load chat history');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser.location) {
      loadChatHistory();
    }
  }, [currentUser.location]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !socketRef.current || !isConnected) {
      return;
    }

    // Stop typing indicator
    if (isTyping) {
      socketRef.current.emit('typing', {
        userId: currentUser.userId,
        userName: currentUser.userName,
        location: currentUser.location,
        isTyping: false
      });
      setIsTyping(false);
    }

    // Send message
    socketRef.current.emit('sendMessage', {
      userId: currentUser.userId,
      userName: currentUser.userName,
      message: newMessage.trim(),
      location: currentUser.location
    });

    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socketRef.current || !isConnected) return;

    // Start typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        userId: currentUser.userId,
        userName: currentUser.userName,
        location: currentUser.location,
        isTyping: true
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        socketRef.current.emit('typing', {
          userId: currentUser.userId,
          userName: currentUser.userName,
          location: currentUser.location,
          isTyping: false
        });
      }
    }, 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const MessageBubble = ({ message, isOwn }) => (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn 
          ? 'bg-orange-500 text-white' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {!isOwn && (
          <div className="text-xs font-semibold mb-1 text-gray-600">
            {message.senderName}
          </div>
        )}
        <div className="break-words">{message.message}</div>
        <div className={`text-xs mt-1 ${
          isOwn ? 'text-orange-100' : 'text-gray-500'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <SideBar location={  user.address.city  } />
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentUser.location.split(',')[0].charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">{currentUser.location}</h1>
              <p className="text-sm text-gray-500">
                {activeUsers} active users
                {!isConnected && ' • Disconnected'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <div className="text-4xl mb-4">💬</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwn={message.senderId === currentUser.userId}
            />
          ))
        )}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 px-4 py-2 rounded-lg max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-600">
                  {typingUsers.length === 1 
                    ? `${typingUsers[0].userName} is typing...`
                    : `${typingUsers.length} people are typing...`
                  }
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          {/* Attachment Button */}
          <button
            type="button"
            className="flex-shrink-0 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
            disabled={!isConnected}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder={isConnected ? "Type a message..." : "Connecting..."}
              className="w-full px-4 py-3 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
              disabled={!isConnected}
              maxLength={1000}
            />
            {newMessage && (
              <div className="absolute right-3 bottom-1 text-xs text-gray-400">
                {newMessage.length}/1000
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="flex-shrink-0 w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        {/* Connection Status */}
        {!isConnected && (
          <div className="flex items-center justify-center mt-2">
            <span className="text-xs text-red-500 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              Reconnecting...
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions (Mobile) */}
      <div className="md:hidden bg-white border-t px-4 py-2">
        <div className="flex justify-center space-x-6">
          <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857M17 11a3 3 0 11-6 0 3 3 0 016 0zm-3-7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Users</span>
          </button>
          
          <button 
            onClick={scrollToBottom}
            className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs">Scroll</span>
          </button>

          <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationChat;