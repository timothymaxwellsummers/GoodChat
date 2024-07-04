// services/chatService.ts
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { saveMessagesToLocalStorage, loadMessagesFromLocalStorage } from './localStorageService';

class ChatService {
  private chat;
  private chain: any;
  private messageHistory;
  private personalInfo: any;

  constructor() {
    this.chat = new ChatOllama({
      baseUrl: "https://ollama.medien.ifi.lmu.de",
      model: "llama2",
    });

    this.messageHistory = new ChatMessageHistory();

    if (typeof window !== 'undefined') {
      this.loadMessages();
    }
  }

  setPersonalInfo(personalInfo: any) {
    this.personalInfo = personalInfo;
    this.updatePrompt();
  }

  private updatePrompt() {
    const systemPrompt = `You are a helpful assistant. Answer all questions to the best of your ability. Here is some information about the user: ${this.personalInfo}`;
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("messages"),
    ]);

    this.chain = prompt.pipe(this.chat);
  }

  async addMessage(content: string): Promise<void> {
    const newMessage = new HumanMessage(content);
    await this.messageHistory.addMessage(newMessage);

    const responseMessage = await this.chain.invoke({
      messages: await this.messageHistory.getMessages(),
    });

    await this.messageHistory.addMessage(new AIMessage(responseMessage.content.toString()));
    this.saveMessages();
  }

  async getMessages(): Promise<(HumanMessage | AIMessage)[]> {
    return this.messageHistory.getMessages();
  }

  private async saveMessages() {
    const messages = await this.messageHistory.getMessages();
    await saveMessagesToLocalStorage("chatMessages", messages);
  }

  private loadMessages() {
    const messages = loadMessagesFromLocalStorage("chatMessages");
    messages.forEach((msg: any) => {
      const messageInstance = msg.id[2] === "HumanMessage"
        ? new HumanMessage(msg.kwargs.content)
        : new AIMessage(msg.kwargs.content);
      this.messageHistory.addMessage(messageInstance);
    });
  }
}

export const chatService = new ChatService();