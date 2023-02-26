const chalk = require('chalk');
const { copySync } = require('fs-extra');
const { 
    isGitHubAvailable, 
    fetchLatestBuild, 
    extractZip, 
    downloadArtifact, 
    rmdir, 
    downloadBranch 
} = require("./utils");
const rimraf = require('rimraf');

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
    "rf",
    "rdf",
    "solid",
    "openvslam",
    "orb-slam3",
    "web"
];

async function buildDocs() {
    if (!isGitHubAvailable()) {
        console.log(chalk.redBright(`Github API is not available!`));
        return;
    }
    
    for (let i in modules) {
        try {
            const module = modules[i];
            const stream = await download(module);
            console.log(chalk.white(`\tRemoving API documentation for '${module}'`));
            await rimraf(module);
            console.log(chalk.white(`\tExtracting API documentation for '${module}'`));
            await extractZip(`_site/docs/${module}`, stream);
            copySync(`_site/docs/${module}/openhps-${module}-gh-pages`, `_site/docs/${module}`, { overwrite: true });
            console.log(chalk.white(`\tCleaning up...`));
            await rimraf(`_site/docs/${module}/openhps-${module}-gh-pages`, { retryDelay: 100, maxRetries: 3 });
        } catch(ex) {
            console.error(chalk.red(`\tUnable to get documentation for ${modules[i]}`));
            console.error(ex);
        }
    }
}

async function download(module) {
    return new Promise((resolve, reject) => {
        console.log(chalk.green(`Downloading API documentation for '${module}'`));
        downloadBranch(module, 'gh-pages').then(resolve)
            .catch(() => {
                console.log(chalk.bgYellowBright.black(`\tConsider moving documentation to Github Pages for '${module}'`));
                fetchLatestBuild(module).then(latestBuild => {
                    return downloadArtifact(latestBuild, 'docs');
                }).then(resolve).catch(reject);
            });
    });
}

module.exports = buildDocs;
