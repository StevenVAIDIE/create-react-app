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

const addPeerDependencies = () => {
    const packageJson = readPackageJson();
    const peerDependencies = packageJson.peerDependencies;

    const newPeerDependencies = {...peerDependencies, ...PEER_DEPENDENCY_PACKAGES};
    savePackageJson({...packageJson, ...{peerDependencies: newPeerDependencies}});
};

addPeerDependencies();
