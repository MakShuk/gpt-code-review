import { LoggerService } from './services/logger/logger.service';
import { CodeReviewService } from './services/review/review.service';

const logger = new LoggerService('main');
const rootDirectory = 'D:/Development/React/parse-web-site/src/';
const rootDirectory2 = 'D:/Development/NodeJS/gpt-code-review/src';

async function start(): Promise<void> {
	const review = new CodeReviewService(rootDirectory);
	const fileMessage = await review.fileReview();
	const folderMessage = await review.folderReview();
	logger.warn(fileMessage);
	logger.warn(folderMessage);
}

start();
