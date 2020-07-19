/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import {
    logErrorPlatform,
    getConfigProp,
    confirmActiveBundler,
    getEntryFile
} from '../common';
import { doResolve } from '../resolve';
import { configureGenericPlatform } from '../platformTools';
import { chalk, logTask, logError, logSummary, logInfo, logRaw } from '../systemTools/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG, TASK_CONFIGURE,
    RN_CLI_CONFIG_NAME
} from '../constants';
import { configureGenericProject } from '../projectTools';
import {
    runXcodeProject,
    exportXcodeProject,
    buildXcodeProject,
    packageBundleForXcode,
    runAppleLog,
    configureXcodeProject
} from '../platformTools/apple';
import {
    packageAndroid,
    runAndroid,
    configureGradleProject,
    buildAndroid,
    runAndroidLog
} from '../platformTools/android';
import { executeAsync } from '../systemTools/exec';

import { isBundlerActive, waitForBundler } from '../platformTools/bundler';
import { mkdirSync, writeFileSync, copyFileSync } from '../systemTools/fileutils';
import { executeTask as _executeTask } from '../engineTools';

const TASKS = {};

let keepRNVRunning = false;

const waitForBundlerIfRequired = async (c) => {
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;
    // return a new promise that does...nothing, just to keep RNV running while the bundler is running
    if (keepRNVRunning) return new Promise(() => {});
    return true;
};

const _startBundlerIfRequired = async (c, parentTask, originTask) => {
    logTask('_startBundlerIfRequired');
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;

    const isRunning = await isBundlerActive(c);
    if (!isRunning) {
        _taskStart(c, parentTask, originTask);
        keepRNVRunning = true;
        await waitForBundler(c);
    } else {
        await confirmActiveBundler(c);
    }
};

const _configureMetroConfigs = async (c, platform) => {
    const configDir = path.join(c.paths.project.dir, 'configs');
    if (!fs.existsSync(configDir)) {
        mkdirSync(configDir);
    }
    const dest = path.join(configDir, `metro.config.${platform}.js`);
    if (!fs.existsSync(dest)) {
        writeFileSync(
            dest,
            `const { EXTENSIONS } = require('rnv/dist/constants');
const config = require('../metro.config');

config.resolver.sourceExts = EXTENSIONS.${platform};
module.exports = config;
`
        );
    }


    // Check rn-cli-config
    if (!fs.existsSync(c.paths.project.rnCliConfig)) {
        logInfo(
            `Looks like your rn-cli config file ${chalk().white(
                c.paths.project.rnCliConfig
            )} is missing! Let's create one for you.`
        );
        copyFileSync(
            path.join(c.paths.rnv.projectTemplate.dir, RN_CLI_CONFIG_NAME),
            c.paths.project.rnCliConfig
        );
    }
};


const BUNDLER_PLATFORMS = {};

BUNDLER_PLATFORMS[IOS] = IOS;
BUNDLER_PLATFORMS[TVOS] = IOS;
BUNDLER_PLATFORMS[ANDROID] = [ANDROID];
BUNDLER_PLATFORMS[ANDROID_TV] = [ANDROID];
BUNDLER_PLATFORMS[ANDROID_WEAR] = [ANDROID];

export const _taskConfigure = async (c, parentTask, originTask) => {
    logTask('_taskConfigure', `parent:${parentTask} origin:${originTask}`);

    await configureGenericPlatform(c);
    await configureGenericProject(c);

    switch (c.platform) {
        case IOS:
        case TVOS:
            return configureXcodeProject(c);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return configureGradleProject(c);
        default:
            return logErrorPlatform(c);
    }
};
TASKS[TASK_CONFIGURE] = _taskConfigure;

export const _taskStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { hosted } = c.program;

    logTask('_taskStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        return logError(
            'This platform does not support hosted mode',
            true
        );
    }

    await _executeTask(c, TASK_CONFIGURE, TASK_START, originTask);

    switch (platform) {
        case IOS:
        case TVOS:
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR: {
            let startCmd = `node ${doResolve(
                'react-native'
            )}/local-cli/cli.js start --port ${
                c.runtime.port
            } --config=configs/metro.config.${c.platform}.js`;

            if (c.program.resetHard) {
                startCmd += ' --reset-cache';
            } else if (c.program.reset && c.command === 'start') {
                startCmd += ' --reset-cache';
            }
            // logSummary('BUNDLER STARTED');
            const url = chalk().cyan(`http://${c.runtime.localhost}:${c.runtime.port}/${
                getEntryFile(c, c.platform)}.bundle?platform=${BUNDLER_PLATFORMS[platform]}`);
            logRaw(`

Dev server running at: ${url}

`);
            return executeAsync(c, startCmd, { stdio: 'inherit', silent: true });
        }
        default:

            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_START] = _taskStart;

const _taskRun = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('_taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    await _executeTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case IOS:
        case TVOS:
            if (!c.program.only) {
                await _startBundlerIfRequired(c, TASK_RUN, originTask);
                await runXcodeProject(c);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runXcodeProject(c);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            if (!c.program.only) {
                await _startBundlerIfRequired(c, TASK_RUN, originTask);
                if (
                    getConfigProp(c, platform, 'bundleAssets') === true
                  || platform === ANDROID_WEAR
                ) {
                    await packageAndroid(c, platform);
                }
                await runAndroid(c, platform, target);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runAndroid(c, platform, target);
        default:
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_RUN] = _taskRun;


const _taskPackage = async (c, parentTask, originTask) => {
    logTask('_taskPackage', `parent:${parentTask}`);
    const { platform } = c;

    const target = c.program.target || c.files.workspace.config.defaultTargets[platform];

    await _executeTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    switch (platform) {
        case IOS:
        case TVOS:
            return packageBundleForXcode(c);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return packageAndroid(
                c,
                platform,
                target,
                platform === ANDROID_WEAR
            );
        default:
            logErrorPlatform(c, platform);
            return false;
    }
};
TASKS[TASK_PACKAGE] = _taskPackage;


const _taskExport = async (c, parentTask, originTask) => {
    logTask('_taskExport', `parent:${parentTask}`);
    const { platform } = c;

    await _executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case IOS:
        case TVOS:
            return exportXcodeProject(c, platform);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            // Android Platforms don't need extra export step
            return true;
        default:
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_EXPORT] = _taskExport;

const _taskBuild = async (c, parentTask, originTask) => {
    logTask('_taskBuild', `parent:${parentTask}`);
    const { platform } = c;

    await _executeTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return buildAndroid(c, platform);
        case IOS:
        case TVOS:
            if (parentTask === TASK_EXPORT) {
                // build task is not necessary when exporting ios
                return true;
            }
            return buildXcodeProject(c, platform);
        default:
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_BUILD] = _taskBuild;

const _taskDeploy = async (c, parentTask, originTask) => {
    logTask('_taskDeploy', `parent:${parentTask}`);

    await _executeTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    // Deploy simply trggets hook
    return true;
};
TASKS[TASK_DEPLOY] = _taskDeploy;

const _taskDebug = async (c, parentTask) => {
    logTask('_taskDebug', `parent:${parentTask}`);
    const { platform } = c;

    switch (platform) {
        default:
            return logErrorPlatform(c, platform);
    }
};
TASKS[TASK_DEBUG] = _taskDebug;

export const _taskLog = async (c, parentTask) => {
    logTask('_taskLog', `parent:${parentTask}`);
    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return runAndroidLog(c);
        case IOS:
        case TVOS:
            return runAppleLog(c);
        default:
            return logErrorPlatform(c, c.platform);
    }
};
TASKS[TASK_LOG] = _taskLog;

const executeTask = async (c, task, parentTask, originTask) => TASKS[task](c, parentTask, originTask);

const applyTemplate = async (c) => {
    await _configureMetroConfigs(c, c.platform);
    return true;
};

export default {
    executeTask,
    applyTemplate
};
