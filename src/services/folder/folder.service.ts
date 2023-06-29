import { LoggerService } from '../logger/logger.service';
import path, { resolve } from 'path';
import fs, { promises as fsPromises } from 'fs';

export class FolderService {
	logger = new LoggerService('FileService');
	dirPath: string;

	constructor(private fileName: string) {
		this.dirPath = resolve(fileName);
	}

	async getDirectories(dirPath: string = this.dirPath): Promise<string[]> {
		const files = await fsPromises.readdir(dirPath);
		const directories = await Promise.all(
			files.map(async (file) => {
				const filePath = path.join(dirPath, file);
				const stats = await fsPromises.stat(filePath);
				if (stats.isDirectory()) {
					return this.getDirectories(filePath);
				}
				return [];
			}),
		);

		const subDirectories = directories.flat();
		return [dirPath.replace(/\//g, '\\'), ...subDirectories];
	}
}
