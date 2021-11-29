const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const { exec } = require('child_process');
const fs = require('fs');
const { isGitHubAvailable, fetchLatestBuild, extractZip, downloadArtifact, rmdir } = require("./utils");

async function buildOntology() {
    if (!isGitHubAvailable()) {
        return;
    }
    
    const stream = await downloadOntology();
    console.log(chalk.yellow(`\tExtracting ontology ...'`));
    await extractZip(`_ontology/`, stream);
    const widocoJar = await downloadWidoco();
    const version = 'v1';
    await executeWidoco(
        widocoJar, 
        path.join(__dirname, `../_ontology/${version}/openhps.ttl`), 
        path.join(__dirname, `../_site/terms/${version}`)
    );
    await rmdir(`_ontology`);
    console.log(chalk.yellow(`\tCreating Netlify rewrites ...'`));
    await createRedirects(version);
}

async function downloadOntology() {
    return new Promise((resolve, reject) => {
        console.log(chalk.redBright(`Downloading ontology from github.com/OpenHPS/openhps-rdf ...`));
        fetchLatestBuild('rdf').then(latestBuild => {
            return downloadArtifact(latestBuild, 'ontology');
        }).then(resolve).catch(reject);
    });
}

async function downloadWidoco(version = "1.4.15") {
    return new Promise((resolve, reject) => {
        const file = path.join(__dirname, `widoco-${version}.jar`);
        console.log(chalk.yellow(`\tDownloading ${file} ...`));
        axios({
            url: `https://github.com/dgarijo/Widoco/releases/download/v${version}/widoco-${version}-jar-with-dependencies.jar`,
            method: 'GET',
            responseType: "stream"
        }).then(async (response) => {
            response.data.pipe(fs.createWriteStream(file)).on("finish", () => resolve(file));
        }).catch(reject);
    });
}

async function executeWidoco(file, ontologyFile, outputFolder) {
    return new Promise((resolve, reject) => {
        console.log(chalk.yellow(`\tExecuting ${file} ...`));
        const cmd = `java -jar ${file} \
            -ontFile ${ontologyFile} \
            -outFolder ${outputFolder} \
            -rewriteAll \
            -oops \
            -webVowl \
            -licensius`;
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                return reject(err);
            }
            resolve(stderr || stdout);
        });
    });
}

async function createRedirects(version) {
    return new Promise((resolve) => {
        const jsonld = path.join(__dirname, `../_site/terms/${version}/ontology.jsonld`);
        const ontology = JSON.parse(fs.readFileSync(jsonld));
        let rewrites = "\n\n";
        ontology.forEach(quad => {
            let originalUri = quad['@id'];
            if (originalUri.startsWith("http://openhps.org/terms#")) {
                originalUri = originalUri.replace("http://openhps.org", "");
                const newUri = originalUri.replace("/terms#", `/terms/${version}#`);
                rewrites = rewrites + `${originalUri}\t${newUri}\n`;
            }
        });
        rewrites += "\n\n";
        fs.appendFileSync(path.join(__dirname, "../_site/_redirects"), rewrites, { flag: "a" });
        resolve();
    });
}

module.exports = buildOntology;
