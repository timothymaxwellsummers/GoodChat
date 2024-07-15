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
  private weatherInfo: any;
  private moodInfo: any;

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

  async setLocationInfo(locationInfo: any) {
    this.locationInfo = locationInfo;
    this.updatePrompt();
  }

  async setWeatherInfo(weatherInfo: any) {
    this.weatherInfo = weatherInfo;
    this.updatePrompt();
  }

  setMoodInfo(moodInfo: any) {
    this.moodInfo = moodInfo;
    this.updatePrompt();
  }

  private updatePrompt() {
    const systemPrompt = `You are a helpful psychotherapist. This is a psychotherapeutic anamnesis form your patient has filled out for you: ${this.personalInfo}. Your patient is located in ${this.locationInfo}. The current weather at his area is ${this.weatherInfo?.current?.temp_c}°C with ${this.weatherInfo?.current?.condition?.text}. Their current mood is ${this.moodInfo}. Create a natural and helpful conversation. Answer all questions to the best of your ability. Keep your answers concise, ideally within 2-3 sentences. Do not generate longer answers than 2-3 sentences. This is very important. Try to stay on topic. Be empathetic. Don't recommend drugs.`;

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

  async getActivityRecommendation() {
    const systemPrompt = `Use one sentence only. Suggest a fun activity. Consider weather ${this.weatherInfo?.temp_c} ${this.weatherInfo?.condition} and ${this.locationInfo}.Try to brighten up the mood ${this.moodInfo}. Don't mention alcohol`;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("messages"),
    ]);

    const chain = prompt.pipe(this.chat);

    const responseMessage = await chain.invoke({
      messages: [],
    });

    return responseMessage.content.toString();
  }
}

export const chatService = new ChatService();
