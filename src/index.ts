import { CreateHtmlPage } from './page/createHtmlPage';
import { CodeReviewService } from './services/review/review.service';
import { FileService } from './services/file/file.service';
import { IPromts, ISettings } from './interfaces/index.interface';
import { ConsoleService } from './services/console/console.service';
import { LoggerService } from './services/logger/logger.service';

const htmlPage = new CreateHtmlPage();
const logger = new LoggerService('index');

async function start(): Promise<void> {
	const settingsFile = new FileService('config/settings.json');
	const promtFile = new FileService('config/promts.json');
	const promts: IPromts[] = await promtFile.readJsonFile();
	const settings: ISettings = await settingsFile.readJsonFile();
	const myConsole = new ConsoleService(settings, promts);
	const cosnsoleData: string = await myConsole.start();

	const review = new CodeReviewService(
		settings.REVIEW_DIRECTOR,
		promts[0].SYSTEM_PROMT,
		settings.EXCLUDE,
	);

	switch (cosnsoleData) {
		case 'new':
			await myConsole.setProjectFolder();
			start();
			break;
		case 'promt':
			myConsole.clearConsole();
			myConsole.infoMessege('SYSTEM_PROMT[0]', promts[0].SYSTEM_PROMT);
			start();
			break;
		case '0':
			htmlPage.initCard(settings.REVIEW_DIRECTOR, await review.folderNameReview());
			htmlPage.initCard(settings.REVIEW_DIRECTOR, await review.fileNameReview());
			stop();
			break;
		default:
			if (!isNaN(Number(cosnsoleData)) && Number(cosnsoleData) <= promts.length) {
				htmlPage.initCards(await review.fileReview(promts[Number(cosnsoleData) - 1].USER_PROMT));
				stop();
			} else {
				logger.error('The request does not exist');
			}
			myConsole.close(true);
	}
	myConsole.close(true);
}

async function stop(): Promise<void> {
	await htmlPage.createResultHtml();
	htmlPage.openPageInBrowser();
}
start();
