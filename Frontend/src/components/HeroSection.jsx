import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Main App component
const App = () => {
  // State to manage chat messages
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", message: "Hello! How can we help you become a vendor?" },
  ]);
  // State to manage the current input message
  const [chatInput, setChatInput] = useState("");
  // State to manage the loading indicator visibility
  const [loading, setLoading] = useState(false);
  // Ref for scrolling chat history to the bottom
  const chatContainerRef = useRef(null);

  // Effect to scroll to the bottom of the chat history whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Function to handle sending messages
  const sendMessage = async () => {
    const userMessage = chatInput.trim();
    if (userMessage === "") return; // Don't send empty messages

    // Add user message to history
    setChatHistory((prevHistory) => [
      ...prevHistory,
      { sender: "user", message: userMessage },
    ]);
    setChatInput(""); // Clear input field
    setLoading(true); // Show loading indicator

    // Prepare chat history for backend (no longer using 'history' variable)

    try {
      const API_URL = "https://chat-vendor.onrender.com/api/chat";
      // Convert chatHistory to the format expected by the API: [{author, text}]
      const formattedHistory = chatHistory.map((msg) => ({
        author: msg.sender === "user" ? "user" : "ai",
        text: msg.message,
      }));
      const payload = {
        userMessage: userMessage,
        history: formattedHistory,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API call failed with status: ${response.status}`
        );
      }

      const result = await response.json();
      // Expecting { intent, response_text }
      if (result && result.response_text) {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          { sender: "bot", message: result.response_text },
        ]);
      } else {
        setChatHistory((prevHistory) => [
          ...prevHistory,
          {
            sender: "bot",
            message: "Sorry, I couldn't get a response. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Backend API error:", error);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        {
          sender: "bot",
          message:
            "Sorry, I'm having trouble connecting to my brain. Please check the server and try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handle key press for sending messages (e.g., Enter key)
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Function to format AI response text professionally
  const formatAIResponse = (text) => {
    if (!text) return text;

    // Clean up the text first
    let cleanText = text.trim();

    // Handle numbered lists (1. 2. 3. etc.)
    if (cleanText.match(/^\d+\./m)) {
      const lines = cleanText.split("\n").filter((line) => line.trim());
      return (
        <div className="space-y-2">
          {lines.map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.match(/^\d+\./)) {
              return (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-orange-200 font-medium">
                    {trimmedLine.match(/^\d+\./)[0]}
                  </span>
                  <span className="flex-1">
                    {trimmedLine.replace(/^\d+\.\s*/, "")}
                  </span>
                </div>
              );
            }
            return (
              <div key={index} className="font-medium">
                {trimmedLine}
              </div>
            );
          })}
        </div>
      );
    }

    // Handle bullet points with asterisks
    if (cleanText.includes("*")) {
      const parts = cleanText.split(/\*+/).filter((part) => part.trim());

      if (parts.length > 1) {
        return (
          <div className="space-y-2">
            {parts.map((part, index) => {
              const trimmedPart = part.trim();
              if (index === 0 && trimmedPart.length > 50) {
                // First part as main introduction
                return (
                  <div key={index} className="font-medium mb-3 text-orange-100">
                    {trimmedPart}
                  </div>
                );
              } else if (trimmedPart) {
                // Other parts as bullet points
                return (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-orange-200 mt-1 font-bold">•</span>
                    <span className="flex-1 leading-relaxed">
                      {trimmedPart}
                    </span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }
    }

    // Handle line breaks for better formatting
    if (cleanText.includes("\n")) {
      const lines = cleanText.split("\n").filter((line) => line.trim());
      return (
        <div className="space-y-2">
          {lines.map((line, index) => (
            <div key={index} className="leading-relaxed">
              {line.trim()}
            </div>
          ))}
        </div>
      );
    }

    // Single text without special formatting
    return <div className="leading-relaxed">{cleanText}</div>;
  };

  return (
    <div className="font-sans  min-h-screen flex items-center justify-center py-10">
      {/* Custom styles for the Inter font and general aesthetics */}
      <style>
        {`
                body {
                    font-family: "Inter", sans-serif;
                    background-color: #f0f0f0; /* Light grey background for the whole page */
                }
                .chat-container {
                    max-height: 600px; /* Increased chat history height */
                    overflow-y: auto; /* Enable scrolling for chat history */
                    scroll-behavior: smooth; /* Smooth scrolling for new messages */
                }
                /* Custom scrollbar for better aesthetics */
                .chat-container::-webkit-scrollbar {
                    width: 8px;
                }
                .chat-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .chat-container::-webkit-scrollbar-thumb {
                    background: #fb923c; /* Orange-500 */
                    border-radius: 10px;
                }
                .chat-container::-webkit-scrollbar-thumb:hover {
                    background: #ea580c; /* Orange-600 */
                }
                `}
      </style>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
        className="w-full max-w-6xl mx-auto p-6 md:p-10 bg-white  shadow-2xl flex flex-col lg:flex-row items-center justify-between space-y-10 lg:space-y-0 lg:space-x-10 "
      >
        {/* Left Section: Tagline and Icon */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            type: "spring",
            bounce: 0.25,
            delay: 0.1,
          }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 lg:w-1/2"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.3,
              delay: 0.2,
            }}
            className="p-6 bg-orange-100 rounded-full shadow-lg transform hover:scale-110 transition duration-300 ease-in-out"
          >
            {/* Vendor Icon (SVG for aesthetic and scalability) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-orange-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              <path d="M12 11h.01"></path>
              <path d="M17 11h.01"></path>
              <path d="M7 11h.01"></path>
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.2,
              delay: 0.3,
            }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
          >
            <span className="text-orange-600">Unlock Your Potential:</span>{" "}
            Become a Vendor Today!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.2,
              delay: 0.4,
            }}
            className="text-lg md:text-xl text-gray-700 max-w-md"
          >
            Join our thriving community and expand your reach. We provide the
            tools and support you need to succeed.
          </motion.p>
        </motion.div>

        {/* Right Section: Chatbox with Framer Motion */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            type: "spring",
            bounce: 0.25,
            delay: 0.2,
          }}
          className="w-full lg:w-1/2 bg-gray-900 p-6 rounded-2xl shadow-xl flex flex-col space-y-4 border border-orange-500"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.2,
              delay: 0.3,
            }}
            className="text-2xl font-bold text-white text-center mb-4"
          >
            Chat with Us!
          </motion.h2>
          {/* Chat History Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.2,
              delay: 0.4,
            }}
            ref={chatContainerRef}
            className="chat-container flex-grow bg-gray-800 p-4 rounded-lg space-y-3"
          >
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: msg.sender === "user" ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  type: "spring",
                  bounce: 0.2,
                  delay: 0.5 + index * 0.05,
                }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-xl shadow-md max-w-[80%] ${
                    msg.sender === "user"
                      ? "bg-gray-700 text-white rounded-br-none"
                      : "bg-orange-500 text-white rounded-bl-none"
                  }`}
                >
                  {msg.sender === "bot"
                    ? formatAIResponse(msg.message)
                    : msg.message}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Chat Input Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              type: "spring",
              bounce: 0.2,
              delay: 0.5,
            }}
            className="flex space-x-3"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-grow p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-600"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Send
            </button>
          </motion.div>
          {/* Loading Indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-white text-center"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce"></div>
                <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce delay-75"></div>
                <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce delay-150"></div>
                <span>Typing...</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.section>
    </div>
  );
};
// Only one export default allowed
export default App;
