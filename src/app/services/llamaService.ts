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
  private locationInfo: any;
  private mood: any;

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

  setLocationInfo(locationInfo: any) {
    this.locationInfo = locationInfo;
    this.updatePrompt();
  }

  setMood(mood: any) {
    this.mood = mood;
    this.updatePrompt();
  }

  private updatePrompt() {
    const systemPrompt = `You are a helpful psychotherapist. This is a psychotherapeutic anamnesis form your patient has filled out for you: ${this.personalInfo}. Create a natural and helpful conversation. Answer all questions to the best of your ability. Try to stay on topic. Be empathic. Don't reccomend drugs. Be concise. Don't use more that two to three sentences per message this is extremely important.`;
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("messages"),
    ]);

    this.chain = prompt.pipe(this.chat);
  }

  async addMessage(content: string): Promise<void> {
    const newMessage = new HumanMessage(`Some additional information on your patient: He is currently in ${this.locationInfo} and is feeling ${this.mood} today. This is the patients chat message you need to answer be concise!:`+content);
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

  async addInitialMessage(): Promise<void> {
    const initialMessage = await this.chain.invoke({
      messages: [],
    });
    await this.messageHistory.addMessage(new AIMessage(initialMessage.content.toString()));
    this.saveMessages();
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