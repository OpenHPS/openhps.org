const https = require('https');
const unzip = require('unzip-stream');
const chalk = require('chalk');
const fs = require('fs-extra');
const rimraf = require('rimraf');

const modules = [
    "core",
    "csv",
    "opencv",
    "mongodb",
    "socket",
    "rest",
    "sphero",
    "spaces",
    "localstorage",
    "imu",
    "fingerprinting",
    "react-native",
    "mqtt"
];

async function downloadDocs() {
    for (let i in modules) {
        const module = modules[i];
        const stream = await download(module);
        await rmdir(module);
        await extract(module, stream);
    }
}

async function rmdir(module) {
    return new Promise((resolve, reject) => {
        console.log(chalk.white(`\tRemoving API documentation for '${module}'`));
        rimraf(`_site/docs/${module}`, (err) => {
            if (err) {
                console.error(chalk.red("\t" + err));
                reject();
            }
            resolve();
        });
    });
}

async function download(module) {
    return new Promise((resolve) => {
        console.log(chalk.green(`Downloading API documentation for '${module}'`));
        const url = `https://ci.mvdw-software.com/job/openhps-${module}/job/dev/Documentation/*zip*/Documentation.zip`;
        https.get(url, function(response) {
            resolve(response);
        });
    });
}

async function extract(module, stream) {
    return new Promise((resolve, reject) => {
        console.log(chalk.white(`\tExtracting API documentation for '${module}'`));
        stream.pipe(unzip.Extract({ path: `_site/docs/${module}` })).on('finish', () => {
            fs.copy(`_site/docs/${module}/Documentation`, `_site/docs/${module}`, function(err) {
                if (err) {
                    console.error(chalk.red("\t" + err));
                    reject();
                }
                rimraf(`_site/docs/${module}/Documentation`, (err) => {
                    if (err) {
                        console.error(chalk.red("\t" + err));
                        reject();
                    }
                    resolve();
                });
            });
        });
    });
}

module.exports = downloadDocs;
