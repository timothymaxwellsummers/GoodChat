import React, { useState, useEffect } from "react";
import { QAObject } from './Questionnaire';
import LlamaService from "../services/llamaService";
import ChatComponent from "./chat";

interface ChatWrapperProps {
    responses: QAObject | null;
    score: number | null;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({ responses, score }) => {
    const [llamaService, setLlamaService] = useState<LlamaService>();

    useEffect(() => {
        if (!responses || !score) return;
        const newLlamaService = new LlamaService("https://ollama.medien.ifi.lmu.de", score, responses);
        setLlamaService(newLlamaService);
    }, [responses, score]);

    return (
        <div>
            {llamaService && <ChatComponent llamaService={llamaService} />}
        </div>
    );
};

export default ChatWrapper;