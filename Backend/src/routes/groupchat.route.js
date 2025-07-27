const express = require("express");
const {
  getMessagesByLocation,
  getRecentMessages,
  getLocationStats,
} = require("../controllers/groupChat.Controller.js")

const router = express.Router();


// API Routes for Group Chat
router.get('/',getMessagesByLocation);
router.get('recent',getRecentMessages);
router.get('/stats',getLocationStats);


module.exports = router