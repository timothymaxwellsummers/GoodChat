import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export class LlamaService {
  private model: ChatOllama;
  //@ts-ignore
  private withMessageHistory: RunnableWithMessageHistory;
  private messageHistories: Record<string, InMemoryChatMessageHistory> = {};

  constructor() {
    this.model = new ChatOllama({
      baseUrl: "https://ollama.medien.ifi.lmu.de",
      model: "llama2",
    });

    const systemPrompt = this.generateSystemPrompt();
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["placeholder", "{chat_history}"],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(this.model);

    this.withMessageHistory = new RunnableWithMessageHistory({
      runnable: chain,
      getMessageHistory: async (sessionId: string) => {
        if (!this.messageHistories[sessionId]) {
          this.messageHistories[sessionId] = new InMemoryChatMessageHistory();
        }
        return this.messageHistories[sessionId];
      },
      inputMessagesKey: "input",
      historyMessagesKey: "chat_history",
    });
  }

  private generateSystemPrompt(): string {
    return `You are a helpful assistant who remembers all details the user shares with you. You answer short in max 300 words. You are specialized in detecting and treating mental health issues.`;
  }

  async generateResponse(
    sessionId: string,
    prompt: string,
    onData: (data: string) => void
  ): Promise<void> {
    const config = {
      configurable: {
        sessionId,
      },
    };

    try {
      const messageHistory = await this.withMessageHistory.getMessageHistory(sessionId);
      console.log("Chat history:", messageHistory.getMessages());

      // Add the user's message to the history
      messageHistory.add(new HumanMessage(prompt));

      // Regenerate the prompt with updated chat history
      const systemPrompt = this.generateSystemPrompt();
      const messages = [
        ["system", systemPrompt],
        //@ts-ignore
        ...messageHistory.getMessages().map((message) => [message.role, message.content] as [string, string]),
      ];

      const chatPrompt = ChatPromptTemplate.fromMessages(messages);
      const chain = chatPrompt.pipe(this.model);

      const stream = await chain.stream({ input: prompt });

      let responseContent = '';
      for await (const chunk of stream) {
        responseContent += chunk.content;
        onData(chunk.content.toString());
      }

      // Add the AI's response to the history
      messageHistory.add(new AIMessage(responseContent));

      console.log("Streaming response finished.");
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate response");
    }
  }
}

export default LlamaService;