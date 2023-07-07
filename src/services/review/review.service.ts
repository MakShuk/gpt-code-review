import path, { basename } from 'path';
import { openai } from '../../openai/openai';
import { FileService } from '../file/file.service';
import { FolderService } from '../folder/folder.service';
import { LoggerService } from '../logger/logger.service';
import { ChatCompletionRequestMessage as Request } from 'openai';

export class CodeReviewService {
	private logger = new LoggerService('CodeReviewService');
	private folder: FolderService;
	private file: FileService;
	private delayMs = 7000;
	private systemMessage: Request;

	constructor(fullPathProject: string, systemMessage: string, excLudeFile?: string[]) {
		this.folder = new FolderService(fullPathProject, excLudeFile);
		this.systemMessage = openai.getSystemMessage(systemMessage);
		this.file = new FileService(__dirname);
	}

	async fileNameReview(question?: string): Promise<string | undefined> {
		const pathArray = this.folder.getFileInDirectories();
		const fileNames: string[] = pathArray.map((filePath) => path.basename(filePath));
		const combinedString = fileNames.join(' ');
		const defaultQuestion = question || `Проверь опечатки в названиях фалов`;
		const message = [];
		message.push(openai.getUserMessage(`${defaultQuestion}: ${combinedString}`));
		this.logger.info('Запрос отправлен', 'fileNameReview');
		const openaiAnswer = await openai.chat(message);
		await this.delay(this.delayMs);
		return openaiAnswer?.content;
	}

	async folderNameReview(question?: string): Promise<string | undefined> {
		const pathArray = await this.folder.getDirectories();
		const combinedString = pathArray.join(' ');
		const defaultQuestion = question || `Проверь опечатки в названиях каталогов из этих путей`;
		const message = [];
		message.push(openai.getUserMessage(`${defaultQuestion}: ${combinedString}`));
		this.logger.info('Запрос отправлен', 'folderNameReview');
		const openaiAnswer = await openai.chat(message);
		await this.delay(this.delayMs);
		return openaiAnswer?.content;
	}

	async fileReview(question?: string): Promise<{ path: string; answer: string }[]> {
		const answerArray: { path: string; answer: string }[] = [];
		const fileNames = this.folder.getFileInDirectories();
		this.logger.warn(`AI requests expected : ${fileNames.length}`);

		let counter = 1;

		for (const fileName of fileNames) {
			const fileContents = await this.file.readFile(fileName);
			const message = [this.systemMessage];
			const defaultQuestion =
				question || `Проверить правильность названия функции в коде. Предложи правильные варианты`;
			message.push(openai.getUserMessage(`${defaultQuestion}: "${fileContents} `));

			const startTime = new Date().getTime();
			this.logger.info('Запрос отправлен', basename(fileName));

			const openaiAnswer = await openai.chat(message);

			const endTime = new Date().getTime();

			counter++;

			if (fileNames.length >= counter) {
				this.logger.info('Задержка', 'fileReview');
				await this.delay(this.delayMs + (endTime - startTime));
			}

			answerArray.push({ path: fileName, answer: openaiAnswer?.content || 'Error Ai answer' });
		}
		return answerArray;
	}
	private delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
}
