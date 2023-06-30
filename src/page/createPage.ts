import { FileService } from '../services/file/file.service';
import { marked } from 'marked';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';

export class CreateHtmlPage {
	private html = '';
	private file = FileService;
	private resultFile = new FileService('./result.html');
	private parseImHtml = marked;
	private options = {
		prefix: 'my-prefix-',
	};

	constructor() {
		marked.use(gfmHeadingId(this.options));
		marked.use(mangle());
	}

	//initCardEl(): string {}

	createResiltHtml(): void {
		const code = `<!doctype html>
        <html>
            <head>
                <meta charset="utf-8"/>
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    #content {
                        display: flex;
                        max-width:  800px;
                        flex-wrap: wrap;
                    }
                    pre {
                        text-wrap: wrap;
                    }
                </style>
                <title>Marked in the browser</title>
            </head>
            <body>
                <div id="content">${this.html}</div>
            </body>
        </html>`;
		this.resultFile.writeFile(this.parseImHtml(code));
	}
}
