/* eslint-disable import/no-cycle */
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import {
    isBuildSchemeSupported,
    logErrorPlatform,
    configureIfRequired,
    cleanPlatformIfRequired,
    getConfigProp,
    confirmActiveBundler,
    getEntryFile
} from '../../common';
import { doResolve } from '../../resolve';
import { isPlatformSupported } from '../../platformTools';
import { logTask, logError, logSummary, logInfo, logRaw } from '../../systemTools/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG,
    RN_CLI_CONFIG_NAME
} from '../../constants';
import {
    runXcodeProject,
    exportXcodeProject,
    buildXcodeProject,
    packageBundleForXcode,
    runAppleLog
} from '../../platformTools/apple';
import {
    packageAndroid,
    runAndroid,
    configureGradleProject,
    buildAndroid,
    runAndroidLog
} from '../../platformTools/android';
import { executeAsync } from '../../systemTools/exec';
import Analytics from '../../systemTools/analytics';

import { isBundlerActive, waitForBundler } from '../../platformTools/bundler';
import { checkSdk } from '../../platformTools/sdkManager';
import { resolvePluginDependants } from '../../pluginTools';
import { mkdirSync, writeFileSync, copyFileSync } from '../../systemTools/fileutils';

const TASKS = {};

let keepRNVRunning = false;

const waitForBundlerIfRequired = async (c) => {
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;
    // return a new promise that does...nothing, just to keep RNV running while the bundler is running
    if (keepRNVRunning) return new Promise(() => {});
    return true;
};

const _startBundlerIfRequired = async (c) => {
    logTask('_startBundlerIfRequired');
    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets');
    if (bundleAssets === true) return;

    const isRunning = await isBundlerActive(c);
    if (!isRunning) {
        _taskStart(c);
        keepRNVRunning = true;
        await waitForBundler(c);
    } else {
        await confirmActiveBundler(c);
    }
};

const BUNDLER_PLATFORMS = {};

BUNDLER_PLATFORMS[IOS] = IOS;
BUNDLER_PLATFORMS[TVOS] = IOS;
BUNDLER_PLATFORMS[ANDROID] = [ANDROID];
BUNDLER_PLATFORMS[ANDROID_TV] = [ANDROID];
BUNDLER_PLATFORMS[ANDROID_WEAR] = [ANDROID];


export const _taskStart = async (c) => {
    const { platform } = c;
    const { hosted } = c.program;

    logTask(
        '_taskStart', `port:${c.runtime.port} hosted:${!!hosted}`
    );

    if (hosted) {
        return logError(
            'This platform does not support hosted mode',
            true
        );
    }

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
            const url = chalk.cyan(`http://${c.runtime.localhost}:${c.runtime.port}/${
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

const _taskRun = async (c) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('_taskRun', `port:${port} target:${target} hosted:${hosted}`);

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);


    switch (platform) {
        case IOS:
        case TVOS:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
                await _startBundlerIfRequired(c);
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
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
                await _startBundlerIfRequired(c);
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


const _taskPackage = async (c) => {
    logTask(`_taskPackage:${c.platform}`);
    const { platform } = c;

    const target = c.program.target || c.files.workspace.config.defaultTargets[platform];

    switch (platform) {
        case IOS:
        case TVOS:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
            }
            return packageBundleForXcode(c, platform);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            if (!c.program.only) {
                await cleanPlatformIfRequired(c, platform);
                await configureIfRequired(c, platform);
                await configureGradleProject(c, platform);
            }
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


const _taskExport = async (c) => {
    logTask(`_taskExport:${c.platform}`);
    const { platform } = c;

    switch (platform) {
        case IOS:
        case TVOS:
            if (!c.program.only) {
                await _taskPackage(c);
            }
            return exportXcodeProject(c, platform);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return _taskBuild(c);
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_EXPORT] = _taskExport;

const _taskBuild = async (c) => {
    logTask(`_taskBuild:${c.platform}`);
    const { platform } = c;

    // const engi getEngineByPlatform(c, c.platform)

    switch (platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            await cleanPlatformIfRequired(c, platform);
            await configureIfRequired(c, platform);
            await configureGradleProject(c, platform);
            await packageAndroid(c, platform);
            await buildAndroid(c, platform);
            return;
        case IOS:
        case TVOS:
            await _taskPackage(c);
            await buildXcodeProject(c, platform);
            return;
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_BUILD] = _taskBuild;

const _taskDeploy = async (c) => {
    logTask(`_taskDeploy:${c.platform}`);
    const { platform } = c;

    switch (platform) {
        case TVOS:
        case IOS:
            if (!c.program.only) {
                return _taskExport(c);
            }
            return;
        case ANDROID_TV:
        case ANDROID_WEAR:
        case ANDROID:
            if (!c.program.only) {
                return _taskBuild(c);
            }
            return;
        default:
            if (!c.program.only) {
                await _taskExport(c);
            }
    }
};
TASKS[TASK_DEPLOY] = _taskDeploy;

const _taskDebug = async (c) => {
    logTask(`_taskDebug:${c.platform}`);
    const { platform } = c;

    switch (platform) {
        default:
            logErrorPlatform(c, platform);
    }
};
TASKS[TASK_DEBUG] = _taskDebug;

export const _taskLog = async (c) => {
    logTask(`_taskLog:${c.platform}`);
    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            await runAndroidLog(c);
            return;
        case IOS:
        case TVOS:
            await runAppleLog(c);
            return;
        default:
            logErrorPlatform(c, c.platform);
    }
};
TASKS[TASK_LOG] = _taskLog;


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
            `Looks like your rn-cli config file ${chalk.white(
                c.paths.project.rnCliConfig
            )} is missing! Let's create one for you.`
        );
        copyFileSync(
            path.join(c.paths.rnv.projectTemplate.dir, RN_CLI_CONFIG_NAME),
            c.paths.project.rnCliConfig
        );
    }
};


const runTask = async (c, task) => {
    logTask('runTask', 'engine-rn');
    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);
    await applyTemplate(c);
    await resolvePluginDependants(c);

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });
    return TASKS[task](c);
};

const applyTemplate = async (c) => {
    await _configureMetroConfigs(c, c.platform);
    return true;
};

export default {
    runTask,
    applyTemplate
};
