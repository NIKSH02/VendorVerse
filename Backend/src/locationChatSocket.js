const GroupMessage = require("./models/GroupMessage");

const locationChatSocket = (io) => {
  // Store active users per location
  const activeUsers = new Map(); // location -> Set of userIds
  const userSockets = new Map(); // userId -> socketId
  const socketUsers = new Map(); // socketId -> userInfo

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  };

  // Helper function to find nearby users within 10km radius
  const findNearbyUsers = (userLat, userLng, maxDistance = 10) => {
    const nearbyUsers = [];
    for (const [socketId, userInfo] of socketUsers.entries()) {
      if (userInfo.coordinates && userInfo.coordinates.lat && userInfo.coordinates.lng) {
        const distance = calculateDistance(
          userLat, userLng,
          userInfo.coordinates.lat, userInfo.coordinates.lng
        );
        if (distance <= maxDistance) {
          nearbyUsers.push({
            ...userInfo,
            distance: distance.toFixed(2)
          });
        }
      }
    }
    return nearbyUsers;
  };

  io.on('connection', (socket) => {
    // Reduced logging - only log unique connections
    if (!socketUsers.has(socket.id)) {
      console.log(`New socket connection: ${socket.id}`);
    }

    // Handle user joining a location-based chat room
    socket.on('joinLocation', (data) => {
      try {
        const { userId, userName, location, coordinates } = data;
        
        if (!userId || !userName || !location) {
          socket.emit('error', { message: 'Missing required fields: userId, userName, or location' });
          return;
        }

        // Check if user is already connected to prevent duplicate logging
        const existingUserInfo = socketUsers.get(socket.id);
        if (existingUserInfo && existingUserInfo.userId === userId && existingUserInfo.location === location) {
          console.log(`User ${userName} already connected to ${location}, skipping duplicate join`);
          return;
        }

        // Store user info with coordinates
        const userInfo = { 
          userId, 
          userName, 
          location,
          coordinates: coordinates || { lat: 0, lng: 0 }
        };
        socketUsers.set(socket.id, userInfo);
        userSockets.set(userId, socket.id);

        // Join the location room
        socket.join(location);

        // Add user to active users for this location
        if (!activeUsers.has(location)) {
          activeUsers.set(location, new Set());
        }
        activeUsers.get(location).add(userId);

        console.log(`User ${userName} (${userId}) joined location: ${location}`, 
          coordinates ? `at coordinates: ${coordinates.lat}, ${coordinates.lng}` : 'without coordinates');

        // Notify others in the location about new user
        socket.to(location).emit('userJoined', {
          userId,
          userName,
          location,
          coordinates,
          timestamp: new Date()
        });

        // Send current active users count to the user
        const activeCount = activeUsers.get(location).size;
        socket.emit('activeUsersUpdate', { 
          location, 
          activeCount,
          message: `${activeCount} users active in your area`
        });

        // If user has coordinates, find nearby users
        if (coordinates && coordinates.lat && coordinates.lng && coordinates.lat !== 0 && coordinates.lng !== 0) {
          const nearbyUsers = findNearbyUsers(coordinates.lat, coordinates.lng);
          socket.emit('nearbyUsers', {
            count: nearbyUsers.length,
            users: nearbyUsers.slice(0, 10) // Limit to 10 users for performance
          });
        }

        // Broadcast updated active count to all users in location
        io.to(location).emit('activeUsersCount', { location, activeCount });

      } catch (error) {
        console.error('Error in joinLocation:', error);
        socket.emit('error', { message: 'Failed to join location chat' });
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        const { userId, userName, message, location, coordinates } = data;
        
        if (!userId || !userName || !message || !location) {
          socket.emit('error', { message: 'Missing required fields for sending message' });
          return;
        }

        if (message.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        if (message.length > 1000) {
          socket.emit('error', { message: 'Message too long (max 1000 characters)' });
          return;
        }

        // Create new message document with coordinates
        const newMessage = new GroupMessage({
          senderId: userId,
          senderName: userName,
          message: message.trim(),
          location,
          coordinates: coordinates || { lat: 0, lng: 0 },
          timestamp: new Date()
        });

        // Save to database
        const savedMessage = await newMessage.save();

        // Prepare message for broadcast
        const messageData = {
          _id: savedMessage._id,
          senderId: savedMessage.senderId,
          senderName: savedMessage.senderName,
          message: savedMessage.message,
          location: savedMessage.location,
          coordinates: savedMessage.coordinates,
          timestamp: savedMessage.timestamp
        };

        // Broadcast message to all users in the location
        io.to(location).emit('receiveMessage', messageData);

        console.log(`Message sent in ${location} by ${userName}: ${message.substring(0, 50)}...`);

      } catch (error) {
        console.error('Error in sendMessage:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { userId, userName, location, isTyping } = data;
      
      if (!userId || !location) {
        return;
      }

      // Broadcast typing status to others in the location (except sender)
      socket.to(location).emit('userTyping', {
        userId,
        userName,
        location,
        isTyping,
        timestamp: new Date()
      });
    });

    // Handle user leaving location
    socket.on('leaveLocation', (data) => {
      try {
        const { userId, location } = data;
        const userInfo = socketUsers.get(socket.id);
        
        if (userInfo && userInfo.location) {
          socket.leave(userInfo.location);
          
          // Remove from active users
          if (activeUsers.has(userInfo.location)) {
            activeUsers.get(userInfo.location).delete(userId);
            
            // If no more users in location, clean up
            if (activeUsers.get(userInfo.location).size === 0) {
              activeUsers.delete(userInfo.location);
            } else {
              // Update active count for remaining users
              const activeCount = activeUsers.get(userInfo.location).size;
              io.to(userInfo.location).emit('activeUsersCount', { 
                location: userInfo.location, 
                activeCount 
              });
            }
          }

          // Notify others about user leaving
          socket.to(userInfo.location).emit('userLeft', {
            userId: userInfo.userId,
            userName: userInfo.userName,
            location: userInfo.location,
            timestamp: new Date()
          });

          console.log(`User ${userInfo.userName} left location: ${userInfo.location}`);
        }
      } catch (error) {
        console.error('Error in leaveLocation:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        const userInfo = socketUsers.get(socket.id);
        
        if (userInfo) {
          const { userId, userName, location } = userInfo;
          
          // Clean up user data
          socketUsers.delete(socket.id);
          userSockets.delete(userId);
          
          // Remove from active users
          if (activeUsers.has(location)) {
            activeUsers.get(location).delete(userId);
            
            if (activeUsers.get(location).size === 0) {
              activeUsers.delete(location);
            } else {
              // Update active count
              const activeCount = activeUsers.get(location).size;
              io.to(location).emit('activeUsersCount', { location, activeCount });
            }
          }

          // Notify others about disconnection
          socket.to(location).emit('userLeft', {
            userId,
            userName,
            location,
            timestamp: new Date()
          });

          console.log(`User ${userName} disconnected from ${location}`);
        }
      } catch (error) {
        console.error('Error in disconnect:', error);
      }
    });

    // Handle ping for connection health check
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  // Cleanup function for graceful shutdown
  const cleanup = () => {
    activeUsers.clear();
    userSockets.clear();
    socketUsers.clear();
  };

  return { cleanup };
};

module.exports = locationChatSocket;