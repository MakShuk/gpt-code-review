import { log } from 'console';
import { FolderService } from './services/folder/folder.service';
import { LoggerService } from './services/logger/logger.service';
import { openai } from './openai/openai';

const logger = new LoggerService('main');
const rootDirectory = 'D:/Development/NodeJS/YandexGPT-ShortArticles/';
const rootDirectory2 = 'D:/Development/NodeJS/gpt-code-review/src';

async function start2(): Promise<void> {
	logger.info('start');
	const scr = new FolderService(rootDirectory2);
	const pathArray = await scr.getDirectories();
	const combinedString = pathArray.join(' ');
	logger.info(combinedString);
	const message = [
		openai.getSystemMessage(
			'Веди себя как профессиональный разработчик программного обеспечения. Правильность структуры проекта. Проверь опечатки',
		),
	];
	message.push(openai.getUserMessage(combinedString));
	const openaiAnswer = await openai.chat(message);
	logger.info(openaiAnswer?.content);
}

async function start(): Promise<void> {
	logger.info('start');
	const scr = new FolderService(rootDirectory2);
	const fileName = scr.getFileInDirectories();
	const combinedString = fileName.join(' ');
	logger.warn(fileName);
	const message = [
		openai.getSystemMessage(
			'Веди себя как профессиональный разработчик программного обеспечения. Правильность названий файлов. Проверь опечатки ',
		),
	];
	message.push(openai.getUserMessage(combinedString));
	const openaiAnswer = await openai.chat(message);
	logger.info(openaiAnswer?.content);
}

start();
