import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { StringOutputParser } from '@langchain/core/output_parsers';

export class LlamaService {
    private model: ChatOllama;

    constructor(baseUrl: string) {
        this.model = new ChatOllama({
            baseUrl: baseUrl,
            model: 'llama2',
        });
    }

    async generateResponse(prompt: string, onData: (data: string) => void): Promise<void> {
        try {
            const stream = await this.model
                .pipe(new StringOutputParser())
                .stream(prompt);

            for await (const chunk of stream) {
                onData(chunk);
            }

            console.log('Streaming response finished.');
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response');
        }
    }
}

export default LlamaService;
