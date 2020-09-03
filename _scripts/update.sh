#!/bin/bash
wget=/usr/bin/wget
unzip=/usr/bin/unzip

# Componentent documentations to download
components=("core" "csv")

function fetch {
    url="https://ci.mvdw-software.com/job/openhps-$1/job/dev/Documentation/*zip*/Documentation.zip"
    echo "Preparing $1 ..."
    find ./docs/$1/ ! -name '.gitkeep' -delete
    echo "Downloading $url ..."
    wget -O ./docs/$1/docs-$1.zip $url
    echo "Unzipping ./docs/$1/docs-$1.zip ..."
    unzip ./docs/$1/docs-$1.zip -d ./docs/$1/ -o
    mv ./docs/$1/Documentation/* ./docs/$1/
    rm -rf ./docs/$1/Documentation
}

for i in "${components[@]}"
do
	fetch $i
done
