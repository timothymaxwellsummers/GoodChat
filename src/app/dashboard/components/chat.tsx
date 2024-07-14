"use client";
import React, { useState, useEffect, use, useReducer, useRef } from "react";
import { chatService } from "../../services/llamaService";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { getProfileData } from "../../services/localStorageService";
import { Weather } from "@/app/types/types";

interface ChatComponentProps {
  children: React.ReactNode;
  weather: Weather;
  mood: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ children, weather, mood }) => {
  const [messages, setMessages] = useState<(HumanMessage | AIMessage)[]>([]);
  const [input, setInput] = useState("");
  const [chatInitialized, setChatInitialized] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const personalInfo = getProfileData();
    chatService.setPersonalInfo(personalInfo);
    chatService.setLocationInfo(weather.location.name);
    chatService.setMood(mood);

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
      setIsBotTyping(true);
      Promise.all([
        chatService.addInitialMessage(),
        chatService.getMessages(),
      ]).then(([_, messages]) => {
        setMessages(messages);
        setIsBotTyping(false);
        forceUpdate();
      });
    }
  }, [chatInitialized]);

  //ToDo doesnt yet work the way it should -> should scroll to bottom whenever a new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    chatService.setLocationInfo(location);
  } , [location]);

  useEffect(() => {
    chatService.setMood(mood);
  } , [mood]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    scrollToBottom();

    setInput("");
    setIsBotTyping(true);
    await chatService.addMessage(input);
    setMessages(await chatService.getMessages());
    setIsBotTyping(false);
    forceUpdate();
    scrollToBottom();
  };

  return (
    <div className="flex flex-col h-screen">
      {isTyping ? (
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
                <p>
                  {msg instanceof HumanMessage ? (
                    <span className="font-semibold">You: </span>
                  ) : (
                    <span className="font-semibold">Clara: </span>
                  )}
                  {msg.content.toString()}
                </p>
              </div>
            ))}
            {isBotTyping && <div>Clara is typing...</div>}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
      <div className="flex items-end p-4 bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <textarea
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            const textarea = e.target;
            textarea.style.height = "auto"; // Reset the height
            textarea.style.height = Math.min(textarea.scrollHeight, 96) + "px"; // Set the height based on scrollHeight, max 96px (3 lines)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type here to chat..."
          rows={1}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none overflow-auto max-h-24 scrollbar-hide"
        />
        <button
          onClick={handleSend}
          className="ml-4 p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 focus:outline-none h-10"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
