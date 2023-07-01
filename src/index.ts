//import { LoggerService } from './services/logger/logger.service';
import config from 'config';
import { CreateHtmlPage } from './page/createHtmlPage';
import { CodeReviewService } from './services/review/review.service';
import { FolderService } from './services/folder/folder.service';
import { LoggerService } from './services/logger/logger.service';
import { FileService } from './services/file/file.service';

const logger = new LoggerService('main');
// const rootDirectory = 'D:/Development/TypeScript/TypeScriptGuru/dist/';
const rootDirectory2 = 'D:/Development/NodeJS/FileScriptTS/';

async function start(): Promise<void> {
	const htmlPage = new CreateHtmlPage();
	const review = new CodeReviewService(rootDirectory2, config.get('SYSTEM_PROMT'));
	const fileNameReviewAnswer = await review.fileNameReview();
	//	const folderReviewAnswer = await review.folderNameReview();
	//	const fileReviewAnswer = await review.fileReview(config.get('USER_PROMT'));
	//	const shortCode = await review.fileReview('Найди ошибки в коде');
	htmlPage.initCard(rootDirectory2, fileNameReviewAnswer);
	//	htmlPage.initCard(rootDirectory2, folderReviewAnswer);
	//	htmlPage.initCards(fileReviewAnswer);
	//	htmlPage.initCards(shortCode);
	await htmlPage.createResultHtml();
	htmlPage.openPageInBrowser();
}
//start();

async function filtrateTest(): Promise<void> {
	const folder = new FolderService(rootDirectory2, [
		'node_modules',
		'.env',
		'package-lock',
		'tsconfig',
		'package',
	]);
	const result = await folder.getFileInDirectories();
	logger.warn(result);

	const json = {
		FOLDER_NAME_REVIEW: false,
		FILE_NAME_REVIEW: false,
		SYSTEM_PROMT:
			'Я хочу, чтобы вы выступили в качестве IT-эксперта. Я предоставлю вам всю\nнеобходимую информацию о моих технических проблемах, и ваша роль\nзаключается в том, чтобы решить мою проблему. Вам следует использовать\nсвои знания в области информатики, сетевой инфраструктуры и IT безопасности, чтобы решить мою проблему. Использование в ваших ответах\nразумного, простого и понятного для людей всех уровней языка будет полезно.\nОбъясни свои решения шаг за шагом и с пояснениями. Старайтесь избегать\nслишком большого количества технических деталей, но используйте их при\nнеобходимости.',
		USER_PROMT: 'Проверь правильность названий перменных',
		EXCLUDE: ['node_modules', '.env', 'package-lock', 'tsconfig', 'package'],
	};

	const js = new FileService('config/default.json');
	js.writeJsonFile(json);
}

filtrateTest();
