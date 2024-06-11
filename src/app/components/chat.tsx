'use client';
import React, { useState } from 'react';
import LlamaService from '../services/llamaService';

const llamaService = new LlamaService('https://ollama.medien.ifi.lmu.de');

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');
    const [isBotTyping, setIsBotTyping] = useState<boolean>(false);
    const sessionId = 'unique-session-id'; // Generate a unique session ID for each user/session

    const sendMessage = async () => {
        if (input.trim() === '') return;

        setMessages([...messages, `You: ${input}`]);
        setInput('');
        setIsBotTyping(true);

        try {
            await llamaService.generateResponse(sessionId, input, (data: string) => {
                setMessages((prevMessages) => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage && lastMessage.startsWith('Bot:')) {
                        return [
                            ...prevMessages.slice(0, -1),
                            `Bot: ${lastMessage.slice(5)}${data}`,
                        ];
                    }
                    return [...prevMessages, `Bot: ${data}`];
                });
            });
        } catch (error) {
            setMessages((prevMessages) => [...prevMessages, 'Bot: Failed to get response']);
        } finally {
            setIsBotTyping(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="chat-box border p-4 rounded">
                {messages.map((message, index) => (
                    <div key={index} className="mb-2">
                        {message}
                    </div>
                ))}
                {isBotTyping && <div>Bot is typing...</div>}
            </div>
            <div className="input-box mt-4 flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow border rounded p-2"
                />
                <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white rounded p-2">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatComponent;
