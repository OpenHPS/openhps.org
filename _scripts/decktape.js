const chalk = require('chalk');
const { spawn } = require('child_process');
let queue = [];
const path = require('path');
const handler = require('serve-handler');
const http = require('http');
const fs = require('fs');

async function decktape(el) {
    el.addAsyncShortcode("decktape", async (title, page) => {
        const url = `http://localhost:3000${page.url}`;
        queue.push({
            title,
            url: url + "?presenter",
            pdf: path.join(page.outputPath, `../${page.fileSlug}_presentation.pdf`),
            widescreen: false
        });
        queue.push({
            title: title + " | Author Version",
            url,
            pdf: path.join(page.outputPath, `../${page.fileSlug}_author_presentation.pdf`),
            widescreen: false,
        });
        queue.push({
            title,
            url: url + "?presenter",
            slug: page.fileSlug,
            widescreen: true,
            images: path.join(page.outputPath, `../`),
        });
        queue.push({
            title: title + " | Author Version",
            url,
            pdf: path.join(page.outputPath, `../${page.fileSlug}_author_presentation-16x9.pdf`),
            widescreen: true
        });
        // Save queue
        fs.writeFileSync('_presentations.json', JSON.stringify(queue), {
            encoding: 'utf-8'
        });
        return "";
    });
}

async function generate() {
    queue = JSON.parse(fs.readFileSync('_presentations.json', {
        encoding: 'utf-8'
    }));
    console.log(`There are ${queue.length} presentations to be generated ...`);
    if (queue.length === 0) {
        return;
    }
    console.log(chalk.blue(`Starting web server for generating PDFs ...`));
    const server = await createServer(3000);
    // Generate pdfs
    for (let i = 0 ; i < queue.length ; i++) {
        const item = queue[i];
        if (!fs.existsSync(item.pdf)) {
            console.log(chalk.blue(`Generating PDF for '${item.title}' ...`));
            console.log(chalk.white(`\t${item.pdf}`));
            await executeDecktape(item);   
        } else {
            console.log(chalk.yellow(`Skipping PDF for '${item.title}'!`));
        }
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
        let process = undefined;

        if (item.images) {
            const screenshotDir = path.join(item.images, "screenshots");
            fs.mkdirSync(screenshotDir);
            process = spawn(
                path.join(__dirname, '../node_modules/.bin/decktape'), 
                [
                    `--screenshots`,
                    `--screenshots-directory ${screenshotDir}`,
                    `--size=1280x720`, item.url, `${item.slug}.pdf`,
                ], {
                    shell: true
                });
        } else {
            process = spawn(
                path.join(__dirname, '../node_modules/.bin/decktape'), 
                [
                    `--size=2048x${item.widescreen ? 1152 : 1536}`, item.url, item.pdf
                ], {
                    shell: true
                });
        } 

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

module.exports = {
    decktape,
    generate
};
