import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { QAObject } from "../components/Questionnaire";
import WeatherService from './weatherService'; // Adjust the import path as necessary

export class LlamaService {
    private model: ChatOllama;
    //@ts-ignore
    private withMessageHistory: RunnableWithMessageHistory;

    constructor(baseUrl: string, score: number, responses: QAObject) {
        this.model = new ChatOllama({
            baseUrl: baseUrl,
            model: 'llama2',
        });

        const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

        const getChain = (systemPrompt: string) => {
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", systemPrompt],
                ["placeholder", "{chat_history}"],
                ["human", "{input}"],
            ]);
            return prompt.pipe(this.model);
        };

        this.withMessageHistory = new RunnableWithMessageHistory({
            runnable: getChain(""), // Initial empty chain
            getMessageHistory: async (sessionId: string) => {
                if (!messageHistories[sessionId]) {
                    messageHistories[sessionId] = new InMemoryChatMessageHistory();
                }
                return messageHistories[sessionId];
            },
            inputMessagesKey: "input",
            historyMessagesKey: "chat_history",
        });
    }

    private generateSystemPrompt(score: number, responses: QAObject, weatherData: any): string {
        const responseEntries = Object.entries(responses)
            .map(([question, answer]) => `${question}: ${answer}`)
            .join("\n");

        const weatherInfo = `Current Weather in Munich:
Temperature: ${weatherData.current.temperature2m}°C
Apparent Temperature: ${weatherData.current.apparentTemperature}°C
Is Day: ${weatherData.current.isDay ? "Yes" : "No"}
Rain: ${weatherData.current.rain}mm`;

        return `You are a helpful assistant who remembers all details the user shares with you. You answer short in max 300 words. You are specialised on detecting and treating mental health issues.\n\n The user has performed the GAD-7 survey that measures general anxiety disorders. Here are the results: ${responseEntries}\nAnd here is the evaluated score:${score}. Use this for more context on the user you are talking to.\n\nAdditionally, here's the current weather information:\n${weatherInfo}`;
    }

    async generateResponse(sessionId: string, prompt: string, onData: (data: string) => void): Promise<void> {
        const weatherData = await WeatherService.getWeather();

        const systemPrompt = this.generateSystemPrompt(0, {}, weatherData); // Replace 0 and {} with actual score and responses if available
        const chain = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["placeholder", "{chat_history}"],
            ["human", "{input}"],
        ]).pipe(this.model);

        this.withMessageHistory.runnable = chain;

        const config = {
            configurable: {
                sessionId,
            },
        };

        try {
            const stream = await this.withMessageHistory.stream(
                {
                    input: prompt,
                },
                config
            );

            for await (const chunk of stream) {
                onData(chunk.content);
            }

            console.log('Streaming response finished.');
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response');
        }
    }
}

export default LlamaService;
