const GroupMessage = require("../models/GroupMessage.js")

const groupChatController = {
  // Get all messages for a specific location
  getMessagesByLocation: async (req, res) => {
    try {
      const { location } = req.params;
      const { page = 1, limit = 50 } = req.query;
      
      if (!location) {
        return res.status(400).json({ 
          success: false, 
          message: 'Location parameter is required' 
        });
      }

      // Calculate skip value for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Fetch messages for the location, sorted by timestamp (newest first for pagination)
      const messages = await GroupMessage.find({ location })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      // Reverse to show oldest first in chat
      const reversedMessages = messages.reverse();

      // Get total count for pagination info
      const totalMessages = await GroupMessage.countDocuments({ location });
      const totalPages = Math.ceil(totalMessages / parseInt(limit));

      res.status(200).json({
        success: true,
        data: {
          messages: reversedMessages,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalMessages,
            hasNextPage: parseInt(page) < totalPages,
            hasPrevPage: parseInt(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching messages by location:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error while fetching messages',
        error: error.message 
      });
    }
  },

  // Get recent messages for a location (used for initial load)
  getRecentMessages: async (req, res) => {
    try {
      let { location } = req.params;
      const limit = 30; // Last 30 messages
      
      if (!location) {
        return res.status(400).json({ 
          success: false, 
          message: 'Location parameter is required' 
        });
      }
      
      // Normalize location
      location = location.trim().toLowerCase();
      
      console.log('Fetching messages for location:', location);

      const messages = await GroupMessage.find({ location })
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();

      console.log('Found messages:', messages.length);

      // Return empty array if no messages found
      if (!messages || messages.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            messages: []
          }
        });
      }

      // Reverse to show oldest first in chat
      const reversedMessages = messages.reverse();

      res.status(200).json({
        success: true,
        data: {
          messages: reversedMessages
        }
      });
    } catch (error) {
      console.error('Error fetching recent messages:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error while fetching recent messages',
        error: error.message 
      });
    }
  },

  // Get message statistics for a location
  getLocationStats: async (req, res) => {
    try {
      const { location } = req.params;
      
      if (!location) {
        return res.status(400).json({ 
          success: false, 
          message: 'Location parameter is required' 
        });
      }

      const totalMessages = await GroupMessage.countDocuments({ location });
      const uniqueSenders = await GroupMessage.distinct('senderId', { location });
      
      // Get message count for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayMessages = await GroupMessage.countDocuments({ 
        location, 
        timestamp: { $gte: today } 
      });

      res.status(200).json({
        success: true,
        data: {
          totalMessages,
          uniqueUsers: uniqueSenders.length,
          todayMessages
        }
      });
    } catch (error) {
      console.error('Error fetching location stats:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error while fetching stats',
        error: error.message 
      });
    }
  }
};

module.exports = groupChatController;