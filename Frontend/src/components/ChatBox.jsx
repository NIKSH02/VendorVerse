import React, { useState } from "react";

const API_URL = "https://chat-vendor.onrender.com/api/chat";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const getGeminiResponse = async (userMessage, history) => {
    setIsAiTyping(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage, history })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API call failed with status: ${response.status}`);
      }
      const result = await response.json();
      return result;
    } catch (error) {
      return {
        intent: "ERROR",
        response_text: "Sorry, I'm having trouble connecting to my brain. Please try again later."
      };
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    const history = newMessages.map((msg) => ({ role: msg.sender, content: msg.text }));
    const aiResponse = await getGeminiResponse(input, history);
    setMessages((prev) => [...prev, { sender: "bot", text: aiResponse.response_text }]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-[#fbbf24] text-black" : "bg-[#445D48] text-white"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isAiTyping && <div className="text-xs text-gray-400">AI is typing...</div>}
      </div>
      <form onSubmit={handleSend} className="flex p-2 border-t bg-white">
        <input
          type="text"
          className="flex-1 px-3 py-2 border rounded-l focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-[#445D48] text-white px-4 py-2 rounded-r font-semibold">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
