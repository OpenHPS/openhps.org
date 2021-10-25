const axios = require('axios');
const unzip = require('unzip-stream');
const chalk = require('chalk');
const rimraf = require('rimraf');

const token = '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';

/**
 * Documentations to download from github.com/OpenHPS/openhps-*
 */
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
    "mqtt",
    "video",
    "rf"
];

async function downloadDocs() {
    for (let i in modules) {
        try {
            const module = modules[i];
            const stream = await download(module);
            await rmdir(module);
            await extract(module, stream);
        } catch(ex) {
            console.error(ex);
        }
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
    return new Promise((resolve, reject) => {
        console.log(chalk.green(`Downloading API documentation for '${module}'`));
        fetchLatestBuild(module).then(downloadDocumentation).then(resolve).catch(reject);
    });
}

async function fetchLatestBuild(module) {
    return new Promise((resolve, reject) => {
        const url = `https://api.github.com/repos/OpenHPS/openhps-${module}/actions/runs`;
        axios.get(url, {
            headers: {
                'Authorization': `token ${token}`
            }
        }).then((response) => {
            const latestBuild = response.data.workflow_runs[0];
            if (!latestBuild) {
                throw new Error(`No documentation uploaded on github!`);
            }
            resolve(latestBuild);
        })
        .catch(reject);
    });
}

async function downloadDocumentation(latestBuild) {
    return new Promise((resolve, reject) => {
        const url = latestBuild.artifacts_url;
        axios.get(url, {
            headers: {
                'Authorization': `token ${token}`
            }
        }).then((response) => {
            const artifacts = response.data.artifacts;
            const docs = artifacts.find(artifact => artifact.name === 'docs');
            return axios.get(docs.archive_download_url, {
                headers: {
                    'Authorization': `token ${token}`
                },
                responseType: "stream"
            });
        }).then(response => {
            resolve(response.data);
        })
        .catch(reject);
    });
}

async function extract(module, stream) {
    return new Promise((resolve, reject) => {
        console.log(chalk.white(`\tExtracting API documentation for '${module}'`));
        stream.pipe(unzip.Extract({ path: `_site/docs/${module}` })).on('finish', () => {
            resolve();
        }).on('error', reject);
    });
}

module.exports = downloadDocs;
