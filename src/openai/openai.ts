import {
	ChatCompletionRequestMessage as Request,
	ChatCompletionResponseMessage as Response,
	Configuration,
	OpenAIApi,
} from 'openai';
//import config from 'config';
import { LoggerService } from '../services/logger/logger.service';
import 'dotenv/config';

//config.get('CHATGPT_TOKEN')

class OpenAi {
	private configuration: Configuration;
	private openai: OpenAIApi;
	private token = process.env.GPT_KEY;
	private logger = new LoggerService('OpenAi');

	constructor() {
		this.configuration = new Configuration({
			apiKey: this.token,
		});
		this.openai = new OpenAIApi(this.configuration);
	}

	async chat(messages: Request[]): Promise<Response | undefined> {
		try {
			const responce = await this.openai.createChatCompletion({
				model: 'gpt-3.5-turbo-16k',
				messages,
				temperature: 0.8,
				/* max_tokens: 150,
				temperature: 0.5, */
			});
			return responce.data.choices[0].message;
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(e.message);
				return this.getAssistantMessage(e.message);
			}
			throw Error('OpenAi Erorr');
		}
	}

	async transcription(readStream: any): Promise<string> {
		try {
			const responce = await this.openai.createTranscription(readStream, 'whisper-1');
			return responce.data.text;
		} catch (error) {
			console.log(`Error while transcription: ${error}`);
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
