// services/chatService.ts
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatMessageHistory} from "langchain/stores/message/in_memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

class ChatService {
  private chat;
  private chain;
  private messageHistory;

  constructor() {
    this.chat = new ChatOllama({
      baseUrl: "https://ollama.medien.ifi.lmu.de",
      model: "llama2",
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant. Answer all questions to the best of your ability."],
      new MessagesPlaceholder("messages"),
    ]);

    this.chain = prompt.pipe(this.chat);
    this.messageHistory = new ChatMessageHistory();
  }

  async addMessage(content: string): Promise<void> {
    const newMessage = new HumanMessage(content);
    await this.messageHistory.addMessage(newMessage);

    const responseMessage = await this.chain.invoke({
      messages: await this.messageHistory.getMessages(),
    });

    await this.messageHistory.addMessage(new AIMessage(responseMessage));
  }

  async getMessages(): Promise<(HumanMessage | AIMessage)[]> {
    return this.messageHistory.getMessages();
  }
}

export const chatService = new ChatService();