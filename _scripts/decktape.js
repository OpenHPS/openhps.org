const chalk = require('chalk');
const { spawn } = require('child_process');
let queue = [];
const path = require('path');
const handler = require('serve-handler');
const crypto = require('crypto');
const http = require('http');
const fs = require('fs');

async function decktape(el) {
    el.addAsyncShortcode("decktape", async (title, page) => {
        const fileBuffer = fs.readFileSync(page.inputPath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const hex = hashSum.digest('hex');

        const url = `http://localhost:3000${page.url}`;
        queue.push({
            title,
            url: url + "?presenter",
            pdf: path.join(page.outputPath, `../${page.fileSlug}_presentation.pdf`),
            widescreen: false,
            hash: hex
        });
        queue.push({
            title: title + " | Author Version",
            url,
            pdf: path.join(page.outputPath, `../${page.fileSlug}_author_presentation.pdf`),
            widescreen: false,
            hash: hex
        });
        queue.push({
            title,
            url: url + "?presenter",
            slug: page.fileSlug,
            widescreen: true,
            images: path.join(page.outputPath, `../`),
            hash: hex
        });
        queue.push({
            title: title + " | Author Version",
            url,
            pdf: path.join(page.outputPath, `../${page.fileSlug}_author_presentation-16x9.pdf`),
            widescreen: true,
            hash: hex
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
    queue_old = fs.existsSync('_presentations_generated.json') ? JSON.parse(fs.readFileSync('_presentations_generated.json', {
        encoding: 'utf-8'
    })) : [];

    console.log(`There are ${queue.length} presentations to be generated ...`);
    console.log(`There are ${queue_old.length} presentations previously generated ...`);
    if (queue.length === 0) {
        return;
    }
    console.log(chalk.blue(`Starting web server for generating PDFs ...`));
    const server = await createServer(3000);
    // Generate pdfs
    for (let i = 0 ; i < queue.length ; i++) {
        const item = queue[i];
        const file = item.pdf ? item.pdf : path.join(__dirname, `../${item.slug}.pdf`)
        const oldItems = queue_old.filter(i => i.pdf === item.pdf);
        if (!fs.existsSync(file) && (oldItems.length > 0 ? oldItems[0].hash !== item.hash : true)) {
            console.log(chalk.blue(`Generating PDF for '${item.title}' ...`));
            console.log(chalk.white(`\t${file}`));
            if (file === undefined){
                console.log(item);
            }
            await executeDecktape(item);   
        } else {
            console.log(chalk.yellow(`Skipping PDF for '${item.title}'!`));
        }
    }
    console.log(chalk.blue(`Stopping web server for generating PDFs!`));
    server.close();
    fs.copyFileSync('_presentations.json', '_presentations_generated.json');
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
            console.log(chalk.white(`\t${screenshotDir}`));
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir);
                process = spawn(
                    path.join(__dirname, '../node_modules/.bin/decktape'), 
                    [
                        `--screenshots`,
                        `--load-pause 100`,
                        `--screenshots-directory ${screenshotDir}`,
                        `--size=2048x1152`, item.url, `${item.slug}.pdf`,
                    ], {
                        shell: true
                    });
            } else {
                console.log(chalk.yellow(`Skipping screenshots for '${item.title}'!`));
                return resolve();
            }
        } else if (item.pdf) {
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
