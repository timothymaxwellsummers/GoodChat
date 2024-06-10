export class LlamaService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async generateResponse(prompt: string, onData: (data: string) => void): Promise<void> {
        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama2',
                    prompt,
                }),
            });

            if (!response.body) {
                throw new Error('ReadableStream not supported in this environment.');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                let lines = buffer.split('\n');

                // Keep the last partial line in the buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim()) {
                        const parsed = JSON.parse(line);
                        onData(parsed.response);
                    }
                }
            }

            // Handle the last part of the buffer if any
            if (buffer.trim()) {
                const parsed = JSON.parse(buffer);
                onData(parsed.response);
            }

            console.log('Streaming response finished.');
        } catch (error) {
            console.error('Error generating response:', error);
            throw new Error('Failed to generate response');
        }
    }
}

export default LlamaService;
