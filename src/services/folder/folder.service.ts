import { LoggerService } from '../logger/logger.service';
import path, { resolve } from 'path';
import fs, { promises as fsPromises } from 'fs';

export class FolderService {
	private logger = new LoggerService('FolderService');
	private dirPath: string;
	private excludedArray: string[];

	constructor(private fileName: string, excludedArray?: string[]) {
		this.dirPath = resolve(fileName);
		this.excludedArray = excludedArray || [];
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
		return this.filtrateArray([dirPath.replace(/\//g, '\\'), ...subDirectories]);
	}

	getFileInDirectories(dirPath: string = this.dirPath): string[] {
		const files = fs.readdirSync(dirPath);
		const fileNames = files.filter((file) => {
			return fs.statSync(path.join(dirPath, file)).isFile();
		});

		const fullPathFiles = fileNames.map((file) => path.join(dirPath, file));
		const subFiles = files.map((file) => {
			const filePath = path.join(dirPath, file);
			if (fs.statSync(filePath).isDirectory()) {
				return this.getFileInDirectories(filePath);
			} else {
				return [filePath];
			}
		});

		return this.filtrateArray(
			[...fullPathFiles, ...subFiles.flat()].filter(
				(value, index) => [...fullPathFiles, ...subFiles.flat()].indexOf(value) === index,
			),
		);
	}

	private filtrateArray(array: string[]): string[] {
		const filteredArray = array.filter(
			(item) => !this.excludedArray.some((value) => item.includes(value)),
		);

		return filteredArray;
	}
}
