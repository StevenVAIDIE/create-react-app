#!/usr/bin/env node

const fs = require('fs');
const SCRIPTS_TO_REMOVE = [
    'build',
    'eject',
    'postinstall',
    'preinstall',
    'start',
    'test',
] ;


const DEPENDENCIES_TO_MOVE_INTO_PEER_DEPENDENCIES = [
    'react',
    'react-dom',
];

const readPackageJson = () => {
    const rawPackageJson = fs.readFileSync('./package.json');

    return JSON.parse(rawPackageJson);
};

const savePackageJson = (data) => {
    fs.writeFileSync('./package.json', JSON.stringify(data));
}

const moveReactAsPeerDependencies = () => {
    const packageJson = readPackageJson();
    const dependencies = packageJson.dependencies;
    const dependenciesToMove = Object.fromEntries(Object.entries(dependencies).filter(([key]) =>
        DEPENDENCIES_TO_MOVE_INTO_PEER_DEPENDENCIES.includes(key)));

    const newPeerDependencies = {...packageJson.peerDependencies, ...dependenciesToMove}
    const newDependencies = Object.fromEntries(Object.entries(dependencies).filter(([key]) =>
        !DEPENDENCIES_TO_MOVE_INTO_PEER_DEPENDENCIES.includes(key)));

    savePackageJson({
        ...packageJson,
        ...{
            dependencies: newDependencies,
            peerDependencies: newPeerDependencies
        }
    });
};

const removeTemporaryScript = () => {
    const packageJson = readPackageJson();
    const newScripts = Object.fromEntries(Object.entries(packageJson.scripts).filter(([key]) =>
        !SCRIPTS_TO_REMOVE.includes(key)));

    savePackageJson({...packageJson, ...{script: newScripts}});
};

moveReactAsPeerDependencies();
removeTemporaryScript();
