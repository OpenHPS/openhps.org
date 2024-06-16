const chalk = require('chalk');
const { copySync, mkdirsSync } = require('fs-extra');
const { 
    isGitHubAvailable, 
    fetchLatestBuild, 
    extractZip, 
    downloadArtifact, 
    downloadBranch 
} = require("./utils");
const { rimrafSync } = require('rimraf');
const { mkdir } = require('fs');

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
    "web",
    "protobuf"
];

const externalModules = [
    ["sembeacon", "openhps"]
];

async function buildDocs() {
    if (!isGitHubAvailable()) {
        console.log(chalk.redBright(`Github API is not available!`));
        return;
    }
    
    for (let i in externalModules) {
        try {
            const [user, module] = externalModules[i];
            const stream = await downloadExternal(user, module);
            console.log(chalk.white(`\tRemoving API documentation for '${user}/${module}'`));
            rimrafSync(`_site/docs/${module}`);
            rimrafSync(`_site/docs/${user}`);
            mkdirsSync(`_site/docs/${user}/`);
            console.log(chalk.white(`\tExtracting API documentation for '${user}/${module}'`));
            await extractZip(`_site/docs/${user}/${module}`, stream);
            copySync(`_site/docs/${user}/${module}/${module}-gh-pages`, `_site/docs/${user}/${module}`, { overwrite: true });
            console.log(chalk.white(`\tCleaning up...`));
            rimrafSync(`_site/docs/${user}/${module}/${module}-gh-pages`, { retryDelay: 100, maxRetries: 3 });
        } catch(ex) {
            console.error(chalk.red(`\tUnable to get documentation for ${externalModules[i][0]}/${externalModules[i][1]}`));
            console.error(ex);
        }
    }

    for (let i in modules) {
        try {
            const moduleName = modules[i];
            const module = `openhps-${moduleName}`;
            const stream = await download(module);
            console.log(chalk.white(`\tRemoving API documentation for '${moduleName}'`));
            rimrafSync(`_site/docs/${module}`);
            rimrafSync(`_site/docs/${moduleName}`);
            console.log(chalk.white(`\tExtracting API documentation for '${moduleName}'`));
            await extractZip(`_site/docs/${module}`, stream);
            copySync(`_site/docs/${module}/${module}-gh-pages`, `_site/docs/${moduleName}`, { overwrite: true });
            console.log(chalk.white(`\tCleaning up...`));
            rimrafSync(`_site/docs/${module}`, { retryDelay: 100, maxRetries: 3 });
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

async function downloadExternal(user, module) {
    return new Promise((resolve, reject) => {
        console.log(chalk.green(`Downloading API documentation for '${user}/${module}'`));
        downloadBranch(module, 'gh-pages', user).then(resolve)
            .catch(() => {
                console.log(chalk.bgYellowBright.black(`\tConsider moving documentation to Github Pages for '${user}/${module}'`));
                fetchLatestBuild(module, user).then(latestBuild => {
                    return downloadArtifact(latestBuild, 'docs');
                }).then(resolve).catch(reject);
            });
    });
}

module.exports = buildDocs;
