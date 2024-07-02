"use client";
import React, { useState, useEffect } from "react";
import { chatService } from "../../services/llamaService";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<(HumanMessage | AIMessage)[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const historyMessages = await chatService.getMessages();
      setMessages(historyMessages);
    };
    fetchMessages();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    await chatService.addMessage(input);
    setMessages(await chatService.getMessages());
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50">
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-3 rounded-lg ${
                msg instanceof HumanMessage
                  ? "bg-blue-100 text-right"
                  : "bg-green-100 text-left"
              }`}
            >
              <p>{msg.content.toString()}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center p-4 bg-white border-t border-gray-200">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
