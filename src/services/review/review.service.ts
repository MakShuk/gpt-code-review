import { openai } from '../../openai/openai';
import { FolderService } from '../folder/folder.service';
import { LoggerService } from '../logger/logger.service';

export class CodeReviewService {
	private logger = new LoggerService();
	private folder: FolderService;
	constructor(fullPathProject: string) {
		this.folder = new FolderService(fullPathProject);
	}

	async fileReview(): Promise<string | undefined> {
		const fileName = this.folder.getFileInDirectories();
		const combinedString = fileName.join(' ');
		this.logger.warn(fileName);
		const message = [
			openai.getSystemMessage(
				'Веди себя как профессиональный разработчик программного обеспечения. Правильность названий файлов. Проверь опечатки',
			),
		];
		message.push(openai.getUserMessage(combinedString));
		const openaiAnswer = await openai.chat(message);
		return openaiAnswer?.content;
	}

	async folderReview(): Promise<string | undefined> {
		const pathArray = await this.folder.getDirectories();
		const combinedString = pathArray.join(' ');
		const message = [
			openai.getSystemMessage(
				'Веди себя как профессиональный разработчик программного обеспечения. Правильность структуры проекта. Проверь опечатки',
			),
		];
		message.push(openai.getUserMessage(combinedString));
		const openaiAnswer = await openai.chat(message);
		return openaiAnswer?.content;
	}
}
