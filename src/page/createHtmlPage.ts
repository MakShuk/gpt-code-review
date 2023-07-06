import { FileService } from '../services/file/file.service';
import { marked } from 'marked';
import { mangle } from 'marked-mangle';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { exec } from 'child_process';
import { LoggerService } from '../services/logger/logger.service';

export class CreateHtmlPage {
	private html = '';
	private file = FileService;
	private resultFile: FileService;
	private parseImHtml = marked;
	private logger = new LoggerService('CreateHtmlPage');
	private options = {
		prefix: 'my-prefix-',
	};

	constructor(savePathHtml?: string) {
		this.resultFile = new FileService(savePathHtml || './result.html');
		marked.use(gfmHeadingId(this.options));
		marked.use(mangle());
	}

	initCard(title: string, body: string | undefined): void {
		this.html += `   <div class="card mb-2">
                                <div class="card-header">
                                    ${this.parseImHtml(title)}
                                </div>
                                <div class="card-body">
                                    <blockquote class="blockquote mb-0">
                                    <p>${this.parseImHtml(body || 'Error Ai answer')}</p>
                                    </blockquote>
                                </div>
                          </div>`;
	}

	initCards(answers: { path: string; answer: string }[]): void {
		answers.forEach((e) => this.initCard(e.path, e.answer));
	}

	openPageInBrowser(): void {
		const command =
			process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
		exec(`${command} ${this.resultFile.path}`, (error) => {
			if (error) {
				this.logger.error(`${error}`);
			}
		});
	}

	async createResultHtml(): Promise<void> {
		const code = `<!doctype html>
        <html>
            <head>
                <meta charset="utf-8"/>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous">
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: auto;
                        font-size: 1rem;
                        max-width:  800px;
                        flex-wrap: wrap;
                    }
                    pre {
                        text-wrap: wrap;
                    }
                    .blockquote {
                        font-size: 1rem;
                    }
                    .highlight {
                        background-color: yellow;
                      }
                    p {
                        margin: 0
                    }
                </style>
                <title>Marked in the browser</title>
            </head>
            <body>
                <div class="root">
                    ${this.html}
                </div>
                <script>
                    function search(messeage) {
                        let text = document.body.innerText;
                        let searchWord = messeage;
                        let regex = new RegExp(searchWord, "gi");
                        let body_re = document.body.innerHTML.replace(regex, '<span class="highlight">' + searchWord + '</span>');
                        document.body.innerHTML = body_re;
                        }
                        
                        
                        document.addEventListener('click', function(event) {
                        let range = document.caretRangeFromPoint(event.clientX, event.clientY);
                        let word = getWordUnderCursor(range);
                        });
                        
                        
                        function getWordUnderCursor(range) {
                        let text = range.startContainer.textContent;
                        let cursorOffset = range.startOffset;
                        let start = text.lastIndexOf(' ', cursorOffset) + 1;
                        let end = text.indexOf(' ', cursorOffset);
                        if (end === -1) {
                            end = text.length;
                        }
                        let word = text.slice(start, end);
                        search(word);
                        }
                </script>
            </body>
        </html>`;
		await this.resultFile.writeFile(code);
	}
}
