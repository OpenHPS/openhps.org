const axios = require('axios');
const unzip = require('unzip-stream');
const rimraf = require('rimraf');

const token = process.env.GITHUB_TOKEN;

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

async function downloadBranch(module, branch) {
    return new Promise((resolve, reject) => {
        const url = `https://github.com/OpenHPS/openhps-${module}/archive/refs/heads/${branch}.zip`;
        axios.get(url, {
            responseType: "stream"
        }).then((response) => {
            resolve(response.data);
        })
        .catch(reject);
    });
}

async function downloadArtifact(latestBuild, name) {
    return new Promise((resolve, reject) => {
        const url = latestBuild.artifacts_url;
        axios.get(url, {
            headers: {
                'Authorization': `token ${token}`
            }
        }).then((response) => {
            const artifacts = response.data.artifacts;
            const artifact = artifacts.find(artifact => artifact.name === name);
            return axios.get(artifact.archive_download_url, {
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

async function extractZip(file, stream) {
    return new Promise((resolve, reject) => {
        stream.pipe(unzip.Extract({ path: file })).on('finish', () => {
            resolve();
        }).on('error', reject);
    });
}

async function rmdir(dir) {
    return new Promise((resolve, reject) => {
        rimraf(dir, (err) => {
            if (err) {
                console.error(chalk.red("\t" + err));
                reject();
            }
            resolve();
        });
    });
}

function isGitHubAvailable() {
    return token !== undefined;
}

module.exports = {
    extractZip,
    fetchLatestBuild,
    downloadArtifact,
    rmdir,
    downloadBranch,
    isGitHubAvailable
};
