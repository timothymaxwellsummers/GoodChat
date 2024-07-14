import React, { useState, useEffect, useReducer, useRef } from "react";
import { chatService } from "../../services/llamaService";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { getProfileData } from "../../services/localStorageService";
import { getWeather } from "../../dashboard/components/Weather";
import { geolocationService } from "../../dashboard/components/Location";
import Options from "./options";

interface ChatComponentProps {
  children: React.ReactNode;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ children }) => {
  const [messages, setMessages] = useState<(HumanMessage | AIMessage)[]>([]);
  const [input, setInput] = useState("");
  const [chatInitialized, setChatInitialized] = useState(false);
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [activityRecommendation, setActivityRecommendation] = useState<string | null>(null);

  useEffect(() => {
    const personalInfo = getProfileData();
    chatService.setPersonalInfo(personalInfo);

    const fetchMessages = async () => {
      try {
        const historyMessages = await chatService.getMessages();
        setMessages(historyMessages);
      } catch (err) {
        setError("Failed to fetch chat history");
        console.error("Error fetching messages:", err);
      }
    };

    const fetchWeatherAndRecommendation = async () => {
      try {
        const position = await geolocationService.getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const weatherData = await getWeather(latitude, longitude);
        await chatService.setLocationInfo(position);
        await chatService.setWeatherInfo(weatherData);
        setWeatherInfo(weatherData);
        
        const recommendation = await chatService.getActivityRecommendation(position, weatherData);
        setActivityRecommendation(recommendation);
      } catch (err) {
        setError("Failed to fetch weather data or activity recommendation");
        console.error("Error fetching weather or recommendation:", err);
      }
    };

    fetchMessages();
    fetchWeatherAndRecommendation();
    setChatInitialized(true);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setInput("");
    setIsBotTyping(true);
    try {
      await chatService.addMessage(input);
      const updatedMessages = await chatService.getMessages();
      setMessages(updatedMessages);
    } catch (err) {
      setError("Failed to send message");
      console.error("Error sending message:", err);
    } finally {
      setIsBotTyping(false);
      forceUpdate();
      scrollToBottom();
    }
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
        <Options // Pass props to Options component
          weatherInfo={weatherInfo}
          activityRecommendation={activityRecommendation}
          error={error}
        />
      )}
      <div className="flex items-end p-4 bg-white border-t border-gray-200 fixed bottom-0 w-full">
        <textarea
          onFocus={() => setIsTyping(true)}
          onBlur={() => setIsTyping(false)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            const textarea = e.target;
            textarea.style.height = "auto";
            textarea.style.height = Math.min(textarea.scrollHeight, 96) + "px";
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
