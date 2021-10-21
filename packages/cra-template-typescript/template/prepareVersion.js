#!/usr/bin/env node

const fs = require('fs');

const PEER_DEPENDENCY_PACKAGES = {
    "babel-loader": "8.1.0",
    "eslint": "^7.11.0",
    "styled-components": "^5.1.1"
};

const readPackageJson = () => {
    const rawPackageJson = fs.readFileSync('./package.json');

    return JSON.parse(rawPackageJson);
};

const savePackageJson = (data) => {
    fs.writeFileSync('./package.json', JSON.stringify(data));
}

const replaceFrontPackagePaths = (replace) => {
    const rawPackageJson = fs.readFileSync('./package.json');
    const replacedData = rawPackageJson
        .toString('utf8')
        .replace(new RegExp('~\\$FRONT_PACKAGES_PATH~', 'g'), replace)

    fs.writeFileSync('./package.json', replacedData);
};

const addPeerDependencies = () => {
    const packageJson = readPackageJson();
    const peerDependencies = packageJson.peerDependencies;

    const newPeerDependencies = {...peerDependencies, ...PEER_DEPENDENCY_PACKAGES};
    savePackageJson({...packageJson, ...{peerDependencies: newPeerDependencies}});
};

const frontPackagePath = process.env.FRONT_PACKAGE_PATH;
if (frontPackagePath === undefined) {
    throw new Error('FRONT_PACKAGE_PATH should be defined');
}

replaceFrontPackagePaths(frontPackagePath)
addPeerDependencies();
