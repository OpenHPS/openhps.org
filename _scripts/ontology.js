const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const { exec } = require('child_process');
const fs = require('fs-extra');
const rimraf = require('rimraf');

async function buildOntology() {
    const widocoJar = await downloadWidoco();
    await executeWidoco(
        widocoJar, 
        path.join(__dirname, "../_ontology/v1/openhps.ttl"), 
        path.join(__dirname, "../_ontology/v1/widoco.conf"),
        path.join(__dirname, "../_site/owl/v1")
    );
    await moveDoc();
}

async function downloadWidoco(version = "1.4.15") {
    return new Promise((resolve, reject) => {
        const file = path.join(__dirname, `widoco-${version}.jar`);
        console.log(chalk.yellow(`Downloading ${file} ...`));
        axios({
            url: `https://github.com/dgarijo/Widoco/releases/download/v${version}/widoco-${version}-jar-with-dependencies.jar`,
            method: 'GET',
            responseType: "stream"
        }).then(async (response) => {
            response.data.pipe(fs.createWriteStream(file)).on("finish", () => resolve(file));
        }).catch(reject);
    });
}

async function executeWidoco(file, ontologyFile, configFile, outputFolder) {
    return new Promise((resolve, reject) => {
        console.log(chalk.yellow(`Executing ${file} ...`));
        const cmd = `java -jar ${file} \
            -ontFile ${ontologyFile} \
            -confFile ${configFile} \
            -outFolder ${outputFolder} \
            -rewriteAll`;
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            resolve(stderr || stdout);
        });
    });
}

async function moveDoc() {
    return new Promise((resolve, reject) => {
        console.log(chalk.yellow(`Moving Widoco documentation to parent directory ...`));
        fs.copy(path.join(__dirname, `../_site/owl/v1/doc`), path.join(__dirname, `../_site/owl/v1`), function(err) {
            if (err) {
                console.error(chalk.red("\t" + err));
                reject();
            }
            rimraf(path.join(__dirname, `../_site/owl/v1/doc`), (err) => {
                if (err) {
                    console.error(chalk.red("\t" + err));
                    reject();
                }
                resolve();
            });
        });
    });
}

module.exports = buildOntology;
