const GroupMessage = require("./models/GroupMessage");

const locationChatSocket = (io) => {
  // Store active users per location
  const activeUsers = new Map(); // location -> Set of userIds
  const userSockets = new Map(); // userId -> socketId
  const socketUsers = new Map(); // socketId -> userInfo

  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    // Handle user joining a location-based chat room
    socket.on('joinLocation', (data) => {
      
      try {
        let { userId, userName, location } = data;
        if (!userId || !userName || !location) {
          socket.emit('error', { message: 'Missing required fields: userId, userName, or location' });
          return;
        }
        // Normalize location string
        location = location.trim().toLowerCase();
        // Store user info
        socketUsers.set(socket.id, { userId, userName, location });
        userSockets.set(userId, socket.id);
        // Join the location room
        socket.join(location);
        // Add user to active users for this location
        if (!activeUsers.has(location)) {
          activeUsers.set(location, new Set());
        }
        activeUsers.get(location).add(userId);

        console.log(`User ${userName} (${userId}) joined location: ${location}`);

        // Notify others in the location about new user
        socket.to(location).emit('userJoined', {
          userId,
          userName,
          location,
          timestamp: new Date()
        });

        // Send current active users count to the user
        const activeCount = activeUsers.get(location).size;
        socket.emit('activeUsersUpdate', { 
          location, 
          activeCount,
          message: `${activeCount} users active in ${location}`
        });

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
        let { userId, userName, message, location } = data;
        if (!userId || !userName || !message || !location) {
          socket.emit('error', { message: 'Missing required fields for sending message' });
          return;
        }
        // Normalize location string
        location = location.trim().toLowerCase();
        if (message.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }
        if (message.length > 1000) {
          socket.emit('error', { message: 'Message too long (max 1000 characters)' });
          return;
        }
        // Create new message document
        const newMessage = new GroupMessage({
          senderId: userId,
          senderName: userName,
          message: message.trim(),
          location,
          timestamp: new Date()
        });
        // Save to database
        const savedMessage = await newMessage.save();
        if (!savedMessage) {
          socket.emit('error', { message: 'Message not saved to database' });
          return;
        }
        // Prepare message for broadcast
        const messageData = {
          _id: savedMessage._id,
          senderId: savedMessage.senderId,
          senderName: savedMessage.senderName,
          message: savedMessage.message,
          location: savedMessage.location,
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
      let { userId, userName, location, isTyping } = data;
      if (!userId || !location) {
        return;
      }
      location = location.trim().toLowerCase();
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
        let { userId, location } = data;
        const userInfo = socketUsers.get(socket.id);
        if (userInfo && userInfo.location) {
          // Normalize location string
          location = userInfo.location.trim().toLowerCase();
          socket.leave(location);
          // Remove from active users
          if (activeUsers.has(location)) {
            activeUsers.get(location).delete(userId);
            // If no more users in location, clean up
            if (activeUsers.get(location).size === 0) {
              activeUsers.delete(location);
            } else {
              // Update active count for remaining users
              const activeCount = activeUsers.get(location).size;
              io.to(location).emit('activeUsersCount', { 
                location, 
                activeCount 
              });
            }
          }
          // Notify others about user leaving
          socket.to(location).emit('userLeft', {
            userId: userInfo.userId,
            userName: userInfo.userName,
            location,
            timestamp: new Date()
          });
          console.log(`User ${userInfo.userName} left location: ${location}`);
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
          let { userId, userName, location } = userInfo;
          // Normalize location string
          location = location.trim().toLowerCase();
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