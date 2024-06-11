import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export class LlamaService {
    private model: ChatOllama;
    //@ts-ignore
    private withMessageHistory: RunnableWithMessageHistory;

    constructor(baseUrl: string) {
        this.model = new ChatOllama({
            baseUrl: baseUrl,
            model: 'llama2',
        });

        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `You are a helpful assistant who remembers all details the user shares with you.`,
            ],
            ["placeholder", "{chat_history}"],
            ["human", "{input}"],
        ]);

        const chain = prompt.pipe(this.model);

        const messageHistories: Record<string, InMemoryChatMessageHistory> = {};

        this.withMessageHistory = new RunnableWithMessageHistory({
            runnable: chain,
            getMessageHistory: async (sessionId) => {
                if (!messageHistories[sessionId]) {
                    messageHistories[sessionId] = new InMemoryChatMessageHistory();
                }
                return messageHistories[sessionId];
            },
            inputMessagesKey: "input",
            historyMessagesKey: "chat_history",
        });
    }

    async generateResponse(sessionId: string, prompt: string, onData: (data: string) => void): Promise<void> {
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