import { FolderService } from './services/folder/folder.service';
import { LoggerService } from './services/logger/logger.service';
import { openai } from './services/openai/openai.service';

const logger = new LoggerService('main');
const rootDirectory = 'D:/Разарботка/NodeJS/YandexGPT-ShortArticles/src/services';

async function start(): Promise<void> {
	logger.info('start');
	const message = [
		openai.getSystemMessage('Веди себя как дородушный критик в каждом ответе страйся пошутить'),
	];
	message.push(openai.getUserMessage('Привет'));
	const openaiAnswer = await openai.chat(message);
	logger.info(openaiAnswer?.content);
}
start();
