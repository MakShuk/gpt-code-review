import { IPromts, ISettings } from '../../interfaces/index.interface';
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
	constructor(private settings: ISettings, private promts: IPromts[]) {
		this.settings = settings;
		this.consoleInterface = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});
	}
	async start(): Promise<string> {
		console.log(dedent`
                         ${help('CHAT GPT CODE REVIEWS')}
        -----------------------------------------------------------
        ${weather('PATH')} ${this.settings.REVIEW_DIRECTOR}
        -----------------------------------------------------------
        ${weather('OPEN_AI_CONTEXT')}:${error(false)}
        -----------------------------------------------------------
        Comand:
        ${success('new')}: set a new path for the project folder
        ${success('promt')}: output using system promt
        ----------------------------------------------------------- 
       `);
		this.promtsMessege();
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

	infoMessege(title: string, message: string): void {
		console.log(dedent`
        -----------------------------------------------------------
        ${weather(`${title}`)}:  ${message};
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

	//	${success('0')}: folder and file name review

	private promtsMessege(): void {
		console.log(dedent`${success('0')}: folder and file name review
		-----------------------------------------------------------`);
		this.promts.map((e, index) => {
			//	this.infoMessege(`${index}`, `${e.USER_PROMT}`);
			console.log(dedent`
			${success(`${index + 1}`)}: ${e.USER_PROMT}
			-----------------------------------------------------------
		   `);
		});
	}
}
