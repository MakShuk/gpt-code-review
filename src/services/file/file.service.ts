import fs from 'fs/promises';
import { WriteStream, createWriteStream, createReadStream, ReadStream } from 'fs';
import { resolve } from 'path';
import { LoggerService } from '../logger/logger.service';
import { dataWriteFile } from './file.type';

export class FileService {
	private logger = new LoggerService('FileService');
	path: string;
	constructor(private fileName: string) {
		this.path = resolve(fileName);
	}

	async writeJsonFile<T>(data: T): Promise<void> {
		try {
			const dataJson = JSON.stringify(data);
			await fs.writeFile(this.fileName, dataJson);
			this.logger.info(`Data written to ${this.fileName}`);
		} catch (error) {
			this.logger.error(error);
		}
	}
	writeFile<T extends dataWriteFile>(data: T): void {
		fs.writeFile(this.fileName, data)
			.then(() => null)
			.catch((e) => this.logger.error(e));
	}

	async readJsonFile<T>(path: string = this.path): Promise<T> {
		try {
			const data = await fs.readFile(path, { encoding: 'utf-8' });
			const jsonData = JSON.parse(data);
			return jsonData;
		} catch (e) {
			if (e instanceof Error) {
				this.logger.error(e.message);
			}
			throw Error('FileService Erorr');
		}
	}

	async readFile(path: string = this.path): Promise<string | null> {
		try {
			const fileContent = await fs.readFile(path, { encoding: 'utf-8' });
			return fileContent;
		} catch (e) {
			this.logger.error(e);
			return null;
		}
	}

	createWriteStream(): WriteStream {
		return createWriteStream(this.path);
	}

	createReadStream(): ReadStream {
		return createReadStream(this.path);
	}

	delete(): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.unlink(this.path)
				.then(() => resolve(`File delete ${this.path}`))
				.catch((e) => reject(e));
		});
	}
	async appendFile(text: string): Promise<void> {
		try {
			await fs.appendFile(this.fileName, `${text}\n`);
			this.logger.info('Лог сохранён!');
		} catch (e) {
			this.logger.error('Ошибка при добавлении в файл:', e);
		}
	}

	async isCreated(): Promise<boolean> {
		try {
			await fs.access(this.path);
			return true;
		} catch (error) {
			return false;
		}
	}
}
