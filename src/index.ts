import config from 'config';
import { CreateHtmlPage } from './page/createHtmlPage';
import { CodeReviewService } from './services/review/review.service';
import { FileService } from './services/file/file.service';
import { ISettings } from './interfaces/index.interface';
import { ConsoleService } from './services/console/console.service';

async function start(): Promise<void> {
	const htmlPage = new CreateHtmlPage();
	const settingsFile = new FileService('config/settings.json');
	const settings: ISettings = await settingsFile.readJsonFile();
	const myConsole = new ConsoleService(settings);
	const cosnsoleData: string = await myConsole.start();

	const review = new CodeReviewService(
		settings.REVIEW_DIRECTOR,
		config.get('SYSTEM_PROMT'),
		settings.EXCLUDE,
	);

	switch (cosnsoleData) {
		case '1':
			await myConsole.setProjectFolder();
			start();
			break;
		case '2':
			myConsole.clearConsole();
			myConsole.infoMessege(config.get('USER_PROMT'));
			start();
			break;
		default:
			if (settings.FOLDER_NAME_REVIEW) {
				const folderReviewAnswer = await review.folderNameReview();
				htmlPage.initCard(settings.REVIEW_DIRECTOR, folderReviewAnswer);
			}

			if (settings.FILE_NAME_REVIEW) {
				const fileNameReviewAnswer = await review.fileNameReview();
				htmlPage.initCard(settings.REVIEW_DIRECTOR, fileNameReviewAnswer);
			}
			myConsole.close(true);
			htmlPage.initCards(await review.fileReview(config.get('USER_PROMT')));
			await htmlPage.createResultHtml();
			htmlPage.openPageInBrowser();
	}
}
start();
