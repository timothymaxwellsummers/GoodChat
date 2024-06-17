"use client";
import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import BasicModal from "./BasicModal";
import { QAObject } from "./Questionnaire";
import LlamaService from "../services/llamaService";

const llamaService = new LlamaService("https://ollama.medien.ifi.lmu.de");

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const sessionId = "unique-session-id"; // Generate a unique session ID for each user/session


  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
    }
}, []);

useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
}, [messages]);


  const sendMessage = async () => {
    
    if (input.trim() === "") return;

    setMessages([...messages, `You: ${input}`]);
    setInput("");
    setIsBotTyping(true);

    try {
      await llamaService.generateResponse(sessionId, input, (data: string) => {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.startsWith("Bot:")) {
            return [
              ...prevMessages.slice(0, -1),
              `Bot: ${lastMessage.slice(5)}${data}`,
            ];
          }
          return [...prevMessages, `Bot: ${data}`];
        });
      });
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        "Bot: Failed to get response",
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleFormSubmit = (responseObject: QAObject) => {
    // Questionnaire response as question: String, answer: number response
    console.log("Received responseObject:", responseObject);
  };

  const handleTotalScore = (score: number) => {
    console.log("Overall score:", score);
  };

  return (
    <Grid container margin={"3vh"}>
      <Grid container justifyContent={"center"} alignItems={"center"}>
        <BasicModal onSubmit={handleFormSubmit} score={handleTotalScore} />
      </Grid>
      <div className="container mx-auto p-6 w-[80%] max-w-full flex flex-col h-screen">
        <div ref={chatBoxRef} className="chat-box flex-grow border border-gray-300 p-4 rounded-lg shadow-md space-y-4 overflow-y-auto mb-4"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
          {messages.map((message, index) => (
             <div key={index} className={`p-2 rounded-lg ${
              message.startsWith('You:') ? 'bg-blue-300 text-gray-700 self-end' : 'bg-gray-100 text-gray-800 self-start'}`}>
              {message}
          </div>
          ))}
          {isBotTyping && <div>Bot is typing...</div>}
        </div>
        <div className="input-box sticky bottom-0 left-0 w-full p-2 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg p-3 shadow-inner"
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
          }}
          placeholder="Type your message..."
          aria-label="Chat input"
          role="textbox"
            />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 text-white rounded p-2"
          >
            Send
          </button>
        </div>
      </div>
    </Grid>
  );
};

export default ChatComponent;
