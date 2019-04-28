import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
import { spawn, execSync } from 'child_process';
import { createPlatformBuild } from '../cli/platform';
import { executeAsync, execShellAsync } from '../exec';
import {
    isPlatformSupported, getConfig, logTask, logComplete, logError,
    getAppFolder, isPlatformActive, configureIfRequired, getAppConfigId,
    getAppVersion, getAppTitle, getAppVersionCode, writeCleanFile, getAppId, getAppTemplateFolder,
    getEntryFile, getAppDescription, getAppAuthor, getAppLicense, logWarning, copyBuildsFolder, getConfigProp,
} from '../common';
import { buildWeb, runWeb } from './web';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';

const configureElectronProject = (c, platform) => new Promise((resolve, reject) => {
    logTask('configureElectronProject');

    // configureIfRequired(c, platform)
    //     .then(() => configureProject(c, platform))
    configureProject(c, platform)
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;
    const mainScript = getConfigProp(c, platform, 'mainScript');

    const packagePath = path.join(appFolder, 'package.json');

    if (!fs.existsSync(packagePath)) {
        logWarning(`Looks like your ${chalk.white(platform)} platformBuild is misconfigured!. let's repair it.`);
        createPlatformBuild(c, platform)
            .then(() => copyBuildsFolder(c, platform))
            .then(() => configureElectronProject(c, platform))
            .then(() => resolve(c))
            .catch(e => reject(e));
        return;
    }

    const pkgJson = path.join(templateFolder, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(pkgJson));

    packageJson.name = `${getAppConfigId(c, platform)}-${platform}`;
    packageJson.productName = `${getAppTitle(c, platform)} - ${platform}`;
    packageJson.version = `${getAppVersion(c, platform)}`;
    packageJson.description = `${getAppDescription(c, platform)}`;
    packageJson.author = getAppAuthor(c, platform);
    packageJson.license = `${getAppLicense(c, platform)}`;
    packageJson.main = './main.js';


    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

    if (bundleAssets) {
        copyFileSync(path.join(templateFolder, '_privateConfig', 'main.js'), path.join(appFolder, 'main.js'));
        copyFileSync(path.join(templateFolder, '_privateConfig', 'webpack.config.js'), path.join(appFolder, 'webpack.config.js'));
    } else {
        writeCleanFile(path.join(templateFolder, '_privateConfig', 'main.dev.js'),
            path.join(appFolder, 'main.js'),
            [
                { pattern: '{{DEV_SERVER}}', override: `http://0.0.0.0:${c.defaultPorts[platform]}` },
            ]);
        copyFileSync(path.join(templateFolder, '_privateConfig', 'webpack.config.dev.js'), path.join(appFolder, 'webpack.config.js'));
    }


    resolve();
});

const buildElectron = (c, platform) => new Promise((resolve, reject) => {
    logTask(`buildElectron:${platform}`);

    const appFolder = getAppFolder(c, platform);
    buildWeb(c, platform)
        .then(() => resolve())
        .catch(e => reject(e));
});

const runElectron = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runElectron:${platform}`);


    const elc = path.resolve(c.nodeModulesFolder, 'electron/cli.js');
    const appFolder = getAppFolder(c, platform);
    const bundleIsDev = getConfigProp(c, platform, 'bundleIsDev') === true;
    const bundleAssets = getConfigProp(c, platform, 'bundleAssets') === true;

    if (bundleAssets) {
        buildElectron(c, platform, bundleIsDev)
            .then(v => _runElectronSimulator(c, platform))
            .then(() => resolve()).catch(e => reject(e));
    } else {
        _runElectronSimulator(c, platform)
            .then(() => runElectronDevServer(c, platform, port))
            .then(() => resolve()).catch(e => reject(e));
    }
});

const _runElectronSimulator = (c, platform) => new Promise((resolve, reject) => {
    const appFolder = getAppFolder(c, platform);
    const elc = path.resolve(c.nodeModulesFolder, 'electron/cli.js');

    const child = spawn(elc, [appFolder], {
        detached: true,
        shell: true,
        env: process.env,
        stdio: 'inherit',
    })
        .on('close', code => process.exit(code))
        .on('error', spawnError => console.error(spawnError));

    child.unref();
    resolve();
});

const runElectronDevServer = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runElectronDevServer:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    copyFileSync(path.join(templateFolder, '_privateConfig', 'webpack.config.dev.js'), path.join(appFolder, 'webpack.config.js'));

    runWeb(c, platform, port)
        .then(() => resolve())
        .catch(e => reject(e));
});

export { configureElectronProject, runElectron, buildElectron, runElectronDevServer };
