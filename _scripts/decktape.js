const chalk = require('chalk');
const { spawn } = require('child_process');
const queue = [];
const path = require('path');
const handler = require('serve-handler');
const http = require('http');

let ready = false;

async function decktape(el) {
    el.addAsyncShortcode("decktape", async (title, page) => {
        const url = `http://localhost:3000${page.url}`;
        queue.push({
            title,
            url: url + "?presenter",
            pdf: path.join(page.outputPath, `../${page.fileSlug}_presentation.pdf`)
        });
        queue.push({
            title: title + " | Author Version",
            url,
            pdf: path.join(page.outputPath, `../${page.fileSlug}_author_presentation.pdf`)
        });
        return "";
    });

    el.on('afterBuild', async () => {
        if (!ready) {
            ready = true;
            generate();
        }
    });
}

async function generate() {
    console.log(chalk.blue(`Starting web server for generating PDFs ...`));
    const server = await createServer(3000);
    // Generate pdfs
    for (let i = 0 ; i < queue.length ; i++) {
        const item = queue[i];
        console.log(chalk.blue(`Generating PDF for '${item.title}' ...`));
        await executeDecktape(item);
    }
    console.log(chalk.blue(`Stopping web server for generating PDFs!`));
    server.close();
}

function createServer(port = 3000) {
    return new Promise((resolve) => {
        const server = http.createServer((request, response) => {
            return handler(request, response, {
                public: path.join(__dirname, '../_site')
            });
        });

        server.listen(port, () => {
            resolve(server);
        });
    });
}

function executeDecktape(item) {
    return new Promise((resolve, reject) => {
        const process = spawn(
            path.join(__dirname, '../node_modules/.bin/decktape'), 
            [
                "--size=2048x1536", item.url, item.pdf
            ], {
                shell: true
            });
        process.on('error', (err) => {
            reject(err);
        });

        process.stdout.on('data', (data) => {
            console.log(chalk.blueBright(`${data}`));
        });
        
        process.on('close', (code) => {
            resolve();
        });
    });
}

module.exports = decktape;
