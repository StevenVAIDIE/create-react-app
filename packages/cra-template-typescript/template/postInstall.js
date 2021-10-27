#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SCRIPTS_TO_REMOVE = [
    'build',
    'eject',
    'postinstall',
    'preinstall',
    'start',
    'test',
];

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

const replaceFrontPackagePaths = () => {
    const absoluteTemplatePath = path.dirname(path.dirname(path.dirname(require.resolve(`akeneo-design-system`))));
    const relativeTemplatePath = path.relative(__dirname, absoluteTemplatePath);

    const rawPackageJson = fs.readFileSync('./package.json');
    const replacedData = rawPackageJson
        .toString('utf8')
        .replace(/\$FRONT_PACKAGES_PATH/g, relativeTemplatePath)

    fs.writeFileSync('./package.json', replacedData);
};

const removeTemporaryScript = () => {
    const packageJson = readPackageJson();
    const newScripts = Object.fromEntries(Object.entries(packageJson.scripts).filter(([key]) =>
        !SCRIPTS_TO_REMOVE.includes(key)));

    savePackageJson({...packageJson, ...{scripts: newScripts}});
};

const removeYarnLock = () => {
    if (fs.existsSync('./yarn.lock')) {
        fs.unlinkSync('./yarn.lock');
    }
}

const replaceApplicationPath = () => {
    const absoluteApplicationPath = process.env.INIT_CWD;
    const relativeApplicationPath = path.relative(__dirname, absoluteApplicationPath);

    const rawPackageJson = fs.readFileSync('./package.json');
    const replacedData = rawPackageJson
        .toString('utf8')
        .replace(/\$APPLICATION_PATH/g, relativeApplicationPath)

    fs.writeFileSync('./package.json', replacedData);
};

replaceFrontPackagePaths();
replaceApplicationPath();
moveReactAsPeerDependencies();
removeTemporaryScript();
removeYarnLock();
