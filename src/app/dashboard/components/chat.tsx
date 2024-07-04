"use client";
import React, { useState, useEffect, use, useReducer } from "react";
import { chatService } from "../../services/llamaService";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { getProfileData } from "../../services/localStorageService";

interface ChatComponentProps {
  children: React.ReactNode;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ children }) => {
  const [messages, setMessages] = useState<(HumanMessage | AIMessage)[]>([]);
  const [input, setInput] = useState("");
  const [chatInitialized, setChatInitialized] = useState(false);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);


  useEffect(() => {
    const personalInfo = getProfileData();
    chatService.setPersonalInfo(personalInfo);

    const fetchMessages = async () => {
      const historyMessages = await chatService.getMessages();
      setMessages(historyMessages);
    };
    fetchMessages();
    setChatInitialized(true);
  }, []);

  useEffect(() => {
    console.log(messages);
    if (chatInitialized && messages.length === 0) {
      Promise.all([
        chatService.addInitialMessage(),
        chatService.getMessages(),
      ]).then(([_, messages]) => {
        setMessages(messages);
        forceUpdate();
      });
    }
  }, [chatInitialized]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setInput("");
    await chatService.addMessage(input);
    setMessages(await chatService.getMessages());
  };

  return (
    <div className="flex flex-col h-screen">
      {children}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-2xl mx-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`my-2 p-3 rounded-lg ${
                msg instanceof HumanMessage
                  ? "bg-sky-50 text-right"
                  : "bg-sky-100 text-left"
              }`}
            >
              <p>{msg.content.toString()}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center p-4 bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="ml-4 p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
