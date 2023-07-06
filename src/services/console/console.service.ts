import { ISettings } from '../../interfaces/index.interface';
import chalk from 'chalk';
import dedent from 'dedent-js';
import readline from 'readline';
import { FileService } from '../file/file.service';

const error = chalk.white.bgRed;
const success = chalk.white.bgGreen;
const help = chalk.white.bgCyan;
const weather = chalk.black.bgWhite;

export class ConsoleService {
	consoleInterface: readline.Interface;
	constructor(private settings: ISettings) {
		this.settings = settings;
		this.consoleInterface = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
	}
	async start(): Promise<string> {
		const fileReviewMasage = this.settings.FILE_NAME_REVIEW
			? `${success(this.settings.FILE_NAME_REVIEW)}`
			: `${error(this.settings.FILE_NAME_REVIEW)}`;
		const folderReviewMasage = this.settings.FOLDER_NAME_REVIEW
			? `${success(this.settings.FOLDER_NAME_REVIEW)}`
			: `${error(this.settings.FOLDER_NAME_REVIEW)}`;
		console.log(dedent`
                         ${help('CHAT GPT CODE REVIEWS')}
        -----------------------------------------------------------
        ${weather('PATH')} ${this.settings.REVIEW_DIRECTOR}
        -----------------------------------------------------------
        ${weather('OPEN_AI_CONTEXT')}:${error(false)}
        ${weather('FILE_NAME_REVIEW')}:${fileReviewMasage}
        ${weather('FOLDER_NAME_REVIEW')}:${folderReviewMasage}
        -----------------------------------------------------------
        Comand:
        ${success('1')}: set a new path for the project folder
        ${success('2')}: output using query
        -----------------------------------------------------------
       `);
		return await this.readConsole();
	}

	async readConsole(messange?: string, close = false): Promise<string> {
		const answer = await new Promise<string>((resolve) => {
			this.consoleInterface.question(
				`                 ${weather(messange || 'PRESS ENTREL TO START OR NUMVER COMAND')}: `,
				(answer: string) => {
					resolve(answer);
				},
			);
		});
		this.close(close);
		return answer;
	}

	infoMessege(message: string): void {
		console.log(dedent`
        -----------------------------------------------------------
        ${weather('new')}:  ${message};
        -----------------------------------------------------------
       `);
	}

	async setProjectFolder(): Promise<void> {
		console.log('setProjectFolder');
		const newPath = await this.readConsole('NEW PATH: ', true);
		const settingsFile = new FileService('config/settings.json');
		const settings = (await settingsFile.readJsonFile<ISettings>()) || null;
		settings ? (settings.REVIEW_DIRECTOR = newPath) : null;
		await settingsFile.writeJsonFile(settings);
	}

	clearConsole(): void {
		readline.cursorTo(process.stdout, 0, 0);
		readline.clearScreenDown(process.stdout);
	}

	close(close = false): void {
		close ? this.consoleInterface.close() : null;
	}
}
