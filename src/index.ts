import config from 'config';
import { CreateHtmlPage } from './page/createHtmlPage';
import { CodeReviewService } from './services/review/review.service';

const rootDirectory = 'D:/Development/TypeScript/TypeScriptGuru/';

async function start(): Promise<void> {
	const htmlPage = new CreateHtmlPage();

	const review = new CodeReviewService(rootDirectory, config.get('SYSTEM_PROMT'));

	if (config.get('FOLDER_NAME_REVIEW')) {
		const folderReviewAnswer = await review.folderNameReview();
		htmlPage.initCard(rootDirectory, folderReviewAnswer);
	}

	if (config.get('FILE_NAME_REVIEW')) {
		const fileNameReviewAnswer = await review.fileNameReview();
		htmlPage.initCard(rootDirectory, fileNameReviewAnswer);
	}

	const fileReviewAnswer = await review.fileReview(config.get('USER_PROMT'));
	htmlPage.initCards(fileReviewAnswer);

	await htmlPage.createResultHtml();
	htmlPage.openPageInBrowser();
}
start();
