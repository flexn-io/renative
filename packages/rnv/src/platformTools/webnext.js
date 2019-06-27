/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
import open from 'open';
import ip from 'ip';
import { execShellAsync } from '../systemTools/exec';
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
    CLI_WEBOS_ARES_INSTALL,
    CLI_WEBOS_ARES_LAUNCH,
    copyBuildsFolder,
    getAppTemplateFolder,
    checkPortInUse,
    logInfo,
    askQuestion,
    finishQuestion,
    resolveNodeModulePath,
    getConfigProp
} from '../common';
import { cleanFolder, copyFolderContentsRecursiveSync, copyFolderRecursiveSync, copyFileSync, mkdirSync } from '../systemTools/fileutils';
import { getMergedPlugin } from '../pluginTools';
import { selectWebToolAndDeploy } from '../deployTools/webTools';

import { RNV_APP_CONFIG_NAME } from '../constants';

const { fork } = require('child_process');

const buildNext = (c, platform) => {
    logTask(`build:${platform}`);
    const defaultDir = 'src';
    const wbp = resolveNodeModulePath(c, 'next/dist/bin/next');

    return execShellAsync(`node ${wbp} build ${defaultDir} `);
};

const _runNextBrowser = (c, platform, port, delay = 0) => new Promise((resolve, reject) => {
    open(`http://0.0.0.0:${port}`);
    resolve();
});

const runNextDevServer = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runNextDevServer:${platform}`);

    const defaultDir = 'src';

    const wds = resolveNodeModulePath(c, 'next/dist/bin/next');
    shell.exec(
        `node ${wds} dev ${defaultDir} --port ${port}`
    );
    resolve();
});

const runNext = (c, platform, port) => new Promise((resolve, reject) => {
    logTask(`runWeb:${platform}:${port}`);

    checkPortInUse(c, platform, port)
        .then((isPortActive) => {
            if (!isPortActive) {
                logInfo(
                    `Looks like your ${chalk.white(platform)} devServer at port ${chalk.white(
                        port
                    )} is not running. Starting it up for you...`
                );
                _runNextBrowser(c, platform, port, 500)
                    .then(() => runNextDevServer(c, platform, port))
                    .then(() => resolve())
                    .catch(e => reject(e));
            } else {
                logInfo(
                    `Looks like your ${chalk.white(platform)} devServer at port ${chalk.white(
                        port
                    )} is already running. ReNativeWill use it!`
                );
                _runNextBrowser(c, platform, port)
                    .then(() => resolve())
                    .catch(e => reject(e));
            }
        })
        .catch(e => reject(e));
});

export { runNext, runNextDevServer, buildNext };
