// services/chatService.ts
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
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

    if (typeof window !== 'undefined') {
      this.loadMessagesFromLocalStorage();
    }
  }

  private async saveMessagesToLocalStorage() {
    if (typeof window !== 'undefined') {
      const messages = await this.messageHistory.getMessages();
      console.log(messages);
      console.log(JSON.stringify(messages));

      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }

  private loadMessagesFromLocalStorage() {
    if (typeof window !== 'undefined') {
      const storedMessages = localStorage.getItem("chatMessages");
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages);
        console.log(parsedMessages);
        parsedMessages.forEach((msg: any) => {
          const messageInstance = msg.id[2] === "HumanMessage"
            ? new HumanMessage(msg.kwargs.content)
            : new AIMessage(msg.kwargs.content);
          this.messageHistory.addMessage(messageInstance);
        });
      }
    }
  }

  async addMessage(content: string): Promise<void> {
    const newMessage = new HumanMessage(content);
    await this.messageHistory.addMessage(newMessage);

    const responseMessage = await this.chain.invoke({
      messages: await this.messageHistory.getMessages(),
    });

    await this.messageHistory.addMessage(new AIMessage(responseMessage.content.toString()));
    this.saveMessagesToLocalStorage();
  }

  async getMessages(): Promise<(HumanMessage | AIMessage)[]> {
    return this.messageHistory.getMessages();
  }
}

export const chatService = new ChatService();