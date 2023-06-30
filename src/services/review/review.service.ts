import { openai } from '../../openai/openai';
import { FileService } from '../file/file.service';
import { FolderService } from '../folder/folder.service';
import { LoggerService } from '../logger/logger.service';

export class CodeReviewService {
	private logger = new LoggerService();
	private folder: FolderService;
	private file = new FileService(__dirname);
	constructor(fullPathProject: string) {
		this.folder = new FolderService(fullPathProject);
	}

	async fileNameReview(): Promise<string | undefined> {
		const fileName = this.folder.getFileInDirectories();
		const combinedString = fileName.join(' ');
		const message = [
			openai.getSystemMessage(
				'Веди себя как профессиональный разработчик программного обеспечения. Проверь толка правильность названий файлов. Проверь опечатки',
			),
		];
		message.push(openai.getUserMessage(combinedString));
		const openaiAnswer = await openai.chat(message);
		return openaiAnswer?.content;
	}

	async folderNameReview(): Promise<string | undefined> {
		const pathArray = await this.folder.getDirectories();
		const combinedString = pathArray.join(' ');
		const message = [
			openai.getSystemMessage(
				'Веди себя как профессиональный разработчик программного обеспечения. Проверь толка правильность названий папок. Проверь опечатки',
			),
		];
		message.push(openai.getUserMessage(combinedString));
		const openaiAnswer = await openai.chat(message);
		return openaiAnswer?.content;
	}

	async fileReview(): Promise<any> {
		const fileName = this.folder.getFileInDirectories();
		const fileContents = await this.file.readFile(fileName[1]);
		const message = [
			openai.getSystemMessage(`Проверь код на опечатки. Проверь правильность названия переменных`),
		];
		message.push(openai.getUserMessage(`${fileContents}`));
		const openaiAnswer = await openai.chat(message);
		return openaiAnswer?.content;
	}

	/* 	private async readFile(path: string) {

	} */
}
