const express = require("express");
const {
  getMessagesByLocation,
  getRecentMessages,
  getLocationStats,
} = require("../controllers/groupChat.Controller.js")

const router = express.Router();


// API Routes for Group Chat
router.get('/:location/recent', getRecentMessages);
router.get('/:location', getMessagesByLocation);
router.get('/:location/stats', getLocationStats);


module.exports = router