"use client";
import React, { useState, useEffect } from 'react';
import { chatService } from "../../services/llamaService";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<(HumanMessage | AIMessage)[]>([]);
  const [input, setInput] = useState('');

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
    setInput('');
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg instanceof HumanMessage ? 'right' : 'left' }}>
            <p>{msg.content.toString()}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatComponent;