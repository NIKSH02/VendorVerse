import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const LocationChat = () => {
  const { user, isAuthenticated } = useAuth();

  // State management (hooks must be called first)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Refs
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const lastLocationRef = useRef(null);
  const currentUserRef = useRef(null);

  // Helper function to get current geolocation
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        setLocationPermission('denied');
        return;
      }

      setIsRequestingLocation(true);
      setError(null);
      
      // Check permission first
      if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          setLocationPermission(result.state);
        });
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(coords);
          setLocationPermission('granted');
          setIsRequestingLocation(false);
          setError(null);
          resolve(coords);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsRequestingLocation(false);
          
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationPermission('denied');
              errorMessage = 'Location access denied. You can still use General Chat.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred while getting location';
              break;
          }
          
          setError(errorMessage);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Increased timeout
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Effect to request location on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      getCurrentLocation().catch(() => {
        // Continue with profile coordinates or fallback
      });
    }
  }, [isAuthenticated, user]);

  // Helper function to create location room based on coordinates
  const createLocationRoom = useCallback((lat, lng) => {
    // Check if coordinates are valid
    if (!lat || !lng || lat === 0 || lng === 0) {
      return 'general-chat'; // Fallback for users without location
    }
    
    // Round coordinates to create grid-based rooms for 10km radius
    // Using approximately 0.1 degree grid (roughly 10-11km at equator)
    const gridLat = Math.round(lat * 10) / 10;
    const gridLng = Math.round(lng * 10) / 10;
    return `geo-${gridLat},${gridLng}`;
  }, []);

  // Create currentUser with coordinates-based location
  // Prioritize current location, then profile coordinates, then fallback
  const currentUser = useMemo(() => {
    const userLat = currentLocation?.lat || user?.address?.geolocation?.lat || 0;
    const userLng = currentLocation?.lng || user?.address?.geolocation?.lng || 0;
    const locationRoom = createLocationRoom(userLat, userLng);
    
    const newUser = {
      userId: user?._id || 'anonymous',
      userName: user?.name || user?.username || 'Anonymous',
      location: locationRoom,
      coordinates: {
        lat: userLat,
        lng: userLng
      },
      displayLocation: userLat && userLng && userLat !== 0 && userLng !== 0 
        ? (currentLocation 
            ? `📍 ${userLat.toFixed(3)}, ${userLng.toFixed(3)} (Current)` 
            : (user?.address?.city || user?.city || `${userLat.toFixed(3)}, ${userLng.toFixed(3)}`))
        : 'General Chat'
    };
    
    currentUserRef.current = newUser;
    return newUser;
  }, [currentLocation, user, createLocationRoom]);

  // Only log once when user or location changes significantly
  const debugInfo = useRef({ lastLocation: null, lastUserId: null, hasLogged: false });
  
  useEffect(() => {
    if (currentUser.location && currentUser.userId !== 'anonymous' && !debugInfo.current.hasLogged) {
      console.log('LocationChat - User location determined:', {
        location: currentUser.location,
        coordinates: currentUser.coordinates,
        displayLocation: currentUser.displayLocation
      });
      debugInfo.current.hasLogged = true;
    }
  }, [currentUser.location, currentUser.userId, currentUser.coordinates, currentUser.displayLocation]);

  // Initialize socket connection (hook must be called before any returns)
  useEffect(() => {
    // Don't initialize socket if user is not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    // Use the current user from ref to avoid dependency issues
    const currentUserData = currentUserRef.current;
    if (!currentUserData) return;

    // Prevent reconnection if location hasn't changed
    if (lastLocationRef.current === currentUserData.location && socketRef.current?.connected) {
      return;
    }

    // Clean up existing socket before creating new one
    if (socketRef.current) {
      socketRef.current.emit('leaveLocation', {
        userId: currentUserData.userId,
        location: lastLocationRef.current
      });
      socketRef.current.disconnect();
    }

    lastLocationRef.current = currentUserData.location;
    
    const serverUrl ='http://localhost:5001';
    
    socketRef.current = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);
      
      // Join location-based room
      socket.emit('joinLocation', {
        userId: currentUserData.userId,
        userName: currentUserData.userName,
        location: currentUserData.location,
        coordinates: currentUserData.coordinates
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('LocationChat - Connection error:', error);
      setError('Failed to connect to chat server');
      setIsConnected(false);
    });

    // Chat event handlers
    socket.on('receiveMessage', (messageData) => {
      setMessages(prev => [...prev, messageData]);
    });

    socket.on('userJoined', () => {
      // Removed console.log to reduce spam
    });

    socket.on('userLeft', () => {
      // Removed console.log to reduce spam
    });

    socket.on('activeUsersCount', (data) => {
      setActiveUsers(data.activeCount);
    });

    socket.on('activeUsersUpdate', (data) => {
      setActiveUsers(data.activeCount);
    });

    socket.on('nearbyUsers', () => {
      // You can store this data in state if you want to show nearby users list
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
          userId: currentUserData.userId,
          location: currentUserData.location
        });
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user]); // Simplified dependencies

  // Load chat history (must be called before any returns)
  useEffect(() => {
    // Don't load chat history if user is not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    const currentUserData = currentUserRef.current;
    if (!currentUserData || !currentUserData.location) {
      setIsLoading(false);
      return;
    }

    const loadChatHistory = async () => {
      try {
        setIsLoading(true);
        const serverUrl = 'http://localhost:5001';
        const url = `${serverUrl}/api/messages/${encodeURIComponent(currentUserData.location)}/recent`;
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(data.data.messages);
          } else {
            setError(data.message || 'Failed to load chat history');
          }
        } else {
          setError(`Failed to load chat history (${response.status})`);
        }
      } catch {
        setError('Failed to load chat history');
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [isAuthenticated, user]); // Simplified dependencies

  // Auto-scroll to bottom when new messages arrive (must be called before any returns)
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Remove excessive console logging - only log once when auth changes
  const hasLoggedMount = useRef(false);
  useEffect(() => {
    if (isAuthenticated && user && !hasLoggedMount.current) {
      console.log('LocationChat - Component mounted for user:', user?.name || 'Anonymous');
      hasLoggedMount.current = true;
    }
  }, [isAuthenticated, user]);

  // Since this is now a protected route, user should always be authenticated
  // But we'll keep a safety check just in case
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

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
      location: currentUser.location,
      coordinates: currentUser.coordinates
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                📍
              </span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-800">{currentUser.displayLocation}</h1>
              <p className="text-sm text-gray-500">
                Local Area Chat • {activeUsers} active users
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

      {/* Location Permission Banner */}
      {locationPermission === 'denied' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span>Enable location access to join local area chats within 10km radius</span>
            </div>
            <button
              onClick={() => getCurrentLocation()}
              className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs"
            >
              Enable Location
            </button>
          </div>
        </div>
      )}

      {/* Location Loading Banner */}
      {isRequestingLocation && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span>Getting your location...</span>
          </div>
        </div>
      )}

      {/* General Chat Notice */}
      {currentUser.location === 'general-chat' && (
        <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>🌍</span>
              <span>You're in General Chat. Enable location to join your local area chat!</span>
            </div>
            {locationPermission !== 'denied' && (
              <button
                onClick={() => getCurrentLocation()}
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs"
                disabled={isRequestingLocation}
              >
                {isRequestingLocation ? 'Getting Location...' : 'Get Location'}
              </button>
            )}
          </div>
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