const chalk = require('chalk');
const { fetchLatestBuild, extractZip, downloadArtifact, rmdir } = require("./utils");

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
    "geospatial",
    "localstorage",
    "imu",
    "fingerprinting",
    "react-native",
    "mqtt",
    "video",
    "rf"
];

async function buildDocs() {
    for (let i in modules) {
        try {
            const module = modules[i];
            const stream = await download(module);
            console.log(chalk.white(`\tRemoving API documentation for '${module}'`));
            await rmdir(module);
            console.log(chalk.white(`\tExtracting API documentation for '${module}'`));
            await extractZip(`_site/docs/${module}`, stream);
        } catch(ex) {
            console.error(ex);
        }
    }
}

async function download(module) {
    return new Promise((resolve, reject) => {
        console.log(chalk.green(`Downloading API documentation for '${module}'`));
        fetchLatestBuild(module).then(latestBuild => {
            return downloadArtifact(latestBuild, 'docs');
        }).then(resolve).catch(reject);
    });
}

module.exports = buildDocs;
