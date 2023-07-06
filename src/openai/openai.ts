import {
	ChatCompletionRequestMessage as Request,
	ChatCompletionResponseMessage as Response,
	Configuration,
	OpenAIApi,
} from 'openai';
import { LoggerService } from '../services/logger/logger.service';
import 'dotenv/config';

class OpenAi {
	private configuration: Configuration;
	private openai: OpenAIApi;
	private token = process.env.GPT_NEW_KEY;
	private logger = new LoggerService('OpenAi');

	constructor() {
		this.configuration = new Configuration({
			apiKey: this.token,
		});
		this.openai = new OpenAIApi(this.configuration);
	}

	async chat(messages: Request[]): Promise<Response | undefined> {
		try {
			const response = await this.openai.createChatCompletion({
				model: 'gpt-3.5-turbo-16k',
				messages,
				/* max_tokens: 150,
				temperature: 0.5, */
			});
			return response.data.choices[0].message;
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(e.message);
				return this.getAssistantMessage(e.message);
			}
			throw Error('OpenAi Erorr');
		}
	}

	async transcription(readStream: File): Promise<string> {
		try {
			const response = await this.openai.createTranscription(readStream, 'whisper-1');
			return response.data.text;
		} catch (error) {
			this.logger.error(`Error while transcription: ${error}`);
			return `Error while transcription: ${error}`;
		}
	}

	getUserMessage(message: string): Request {
		return {
			role: 'user',
			content: message,
		};
	}

	getAssistantMessage(message: string): Request {
		return {
			role: 'assistant',
			content: message,
		};
	}

	getSystemMessage(message: string): Request {
		return {
			role: 'system',
			content: message,
		};
	}
}

export const openai = new OpenAi();
