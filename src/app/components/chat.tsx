"use client";
import React, { useState, useEffect, useRef} from "react";
import LlamaService from "../services/llamaService";
import avatar from '../assets/avatar.png';
import Image from "next/image";

interface Props {
  llamaService: LlamaService;
}

const ChatComponent: React.FC<Props> = ({ llamaService }) => {
  const [messages, setMessages] = useState<string[]>(["Clara: Hello! Thanks for finishing the study...\nHow are you feeling today? Are you bothered by anything specifically?"]);
  const [input, setInput] = useState<string>("");
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const sessionId = "unique-session-id"; // ToDo Generate a unique session ID for each user/session
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
          if (lastMessage && lastMessage.startsWith("Clara:")) {
            return [
              ...prevMessages.slice(0, -1),
              `${lastMessage}${data}`,
            ];
          }
          return [...prevMessages, `Clara: ${data}`];
        });
      });
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        "Clara: Failed to get response",
      ]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <>
      <div className="my-6"/>
      <div className="container mx-auto p-6 w-[80%] max-w-full flex flex-col h-screen">
        <div ref={chatBoxRef} className="chat-box flex-grow border border-gray-300 p-4 rounded-lg shadow-md space-y-4 overflow-y-auto mb-4"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        >
          {messages.map((message, index) => (
            <div key={index} className={`p-2 rounded-lg flex ${
                message.startsWith("You:") ? "bg-blue-300 text-gray-700 self-end" : "bg-gray-100 text-gray-800 self-start"}`}
            >
              {!message.startsWith("You:") && (
                <Image  src={avatar} alt="Bot Avatar" className="w-8 h-8 rounded-full mr-2" width={32} height={32}/>
              )}
              <span>{message}</span>
            </div>
          ))}
          {isBotTyping && <div>Clara is typing...</div>}
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
          <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white rounded p-2">
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatComponent;