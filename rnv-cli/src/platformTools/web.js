import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
import open from 'open';
import { execShellAsync } from '../exec';
import {
    isPlatformSupportedSync,
    getConfig,
    logTask,
    logComplete,
    logError,
    getAppFolder,
    isPlatformActive,
    checkSdk,
    logWarning,
    configureIfRequired,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_TIZEN_EMULATOR,
    CLI_TIZEN,
    CLI_WEBOS_ARES,
    CLI_WEBOS_ARES_PACKAGE,
    CLI_WEBBOS_ARES_INSTALL,
    CLI_WEBBOS_ARES_LAUNCH,
    copyBuildsFolder,
    getAppTemplateFolder,
    checkPortInUse,
    logInfo,
    askQuestion,
    finishQuestion,
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../fileutils';
import { checkDeployConfigTarget, deployToFtp, DEPLOY_TARGETS } from '../deployTools/ftp';
import { deployToNow } from '../deployTools/now';
import { RNV_APP_CONFIG_NAME } from '../constants';

const { fork } = require('child_process');

function buildWeb(c, platform) {
    logTask(`buildWeb:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);


    copyFileSync(
        path.join(templateFolder, '_privateConfig', 'webpack.config.dev.js'),
        path.join(appFolder, 'webpack.config.js')
    );

    const wbp = path.resolve(c.paths.nodeModulesFolder, 'webpack/bin/webpack.js');

    return execShellAsync(`npx cross-env NODE_ENV=production node ${wbp} -p --config ./platformBuilds/${c.appId}_${platform}/webpack.config.js`);
}

const configureWebProject = (c, platform) => new Promise((resolve, reject) => {
    logTask(`configureWebOSProject:${platform}`);

    if (!isPlatformActive(c, platform, resolve)) return;

    // configureIfRequired(c, platform)
    //     .then(() => configureProject(c, platform))
    copyBuildsFolder(c, platform)
        .then(() => configureProject(c, platform))
        .then(() => resolve())
        .catch(e => reject(e));
});

const configureProject = (c, platform, appFolderName) => new Promise((resolve, reject) => {
    logTask(`configureProject:${platform}`);

    resolve();
});

const runWeb = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runWeb:${platform}:${port}`);

    checkPortInUse(c, platform, port)
        .then((isPortActive) => {
            if (!isPortActive) {
                logInfo(
                    `Looks like your ${chalk.white(platform)} devServer at port ${chalk.white(
                        port
                    )} is not running. Starting it up for you...`
                );
                _runWebBrowser(c, platform, port, 500)
                    .then(() => runWebDevServer(c, platform, port))
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                logInfo(
                    `Looks like your ${chalk.white(platform)} devServer at port ${chalk.white(
                        port
                    )} is already running. ReNativeWill use it!`
                );
                _runWebBrowser(c, platform, port)
                    .then(() => resolve())
                    .catch(e => reject(e));
            }
        })
        .catch(e => reject(e));
});

const _runWebBrowser = (c, platform, port, delay = 0) => new Promise((resolve, reject) => {
    // if (delay) {
    //         const process = fork(path.join(c.paths.nodeModulesFolder, 'open', 'index.js'));
    //         process.send(`http://0.0.0.0:${port}`);
    // } else {
    //     open(`http://0.0.0.0:${port}`);
    // }
    open(`http://0.0.0.0:${port}`);
    resolve();
});

const runWebDevServer = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runWebDevServer:${platform}`);

    const appFolder = getAppFolder(c, platform);
    const templateFolder = getAppTemplateFolder(c, platform);
    const wpConfig = path.join(appFolder, 'webpack.config.js');
    const wpPublic = path.join(appFolder, 'public');

    copyFileSync(
        path.join(templateFolder, '_privateConfig', 'webpack.config.dev.js'),
        path.join(appFolder, 'webpack.config.js')
    );

    const wds = path.resolve(c.paths.nodeModulesFolder, 'webpack-dev-server/bin/webpack-dev-server.js');

    shell.exec(
        `node ${wds} -d --devtool source-map --config ${wpConfig}  --inline --hot --colors --content-base ${wpPublic} --history-api-fallback --host 0.0.0.0 --port ${port}`
    );
    resolve();
});

const deployWeb = (c, platform) => new Promise((resolve, reject) => {
    logTask(`deployWeb:${platform}`);
    const argv = require('minimist')(c.process.argv.slice(2));

    const deployType = argv.t;
    // If not passed as argument, check in appConfig
    let promise = Promise.resolve(deployType);
    if (!deployType) {
        const p = c.files.appConfigFile.platforms[platform];
        promise = checkDeployConfigTarget(c, platform, p);
    }
    promise.then((dt) => {
        logTask(`deployType:${dt}`);
        switch (dt) {
        case DEPLOY_TARGETS.FTP:
            deployToFtp(c, platform).then(resolve).catch(reject);
            return;
        case DEPLOY_TARGETS.NOW:
            deployToNow(c, platform).then(resolve).catch(reject);
            return;
        default:
            reject(new Error(`Deploy Type not supported ${dt}`));
        }
    });
});


export { buildWeb, runWeb, configureWebProject, runWebDevServer, deployWeb };
