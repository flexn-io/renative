/* eslint-disable import/no-cycle */
import {
    isBuildSchemeSupported,
    logErrorPlatform,
    configureIfRequired,
    cleanPlatformIfRequired,
    getConfigProp,
    confirmActiveBundler
} from '../../common';
import { doResolve } from '../../resolve';
import { isPlatformSupported } from '../../platformTools';
import { logTask, logError, logSummary } from '../../systemTools/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG
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
import Config from '../../config';
import Analytics from '../../systemTools/analytics';

import { isBundlerActive, waitForBundler } from '../../platformTools/bundler';
import { checkSdk } from '../../platformTools/sdkManager';
import { resolvePluginDependants } from '../../pluginTools';

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
    logTask(`_startBundlerIfRequired:${c.platform}`);
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

export const _taskStart = async (c) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask(
        `_taskStart:${platform}:${port}:${hosted}:${Config.isWebHostEnabled}`
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
    logTask(`_taskRun:${platform}:${port}:${target}:${hosted}`);

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


const runTask = async (c, task) => {
    logTask(`runTask:engine-rn:${c.platform}`);
    await isPlatformSupported(c);
    await isBuildSchemeSupported(c);
    await checkSdk(c);
    await resolvePluginDependants(c);

    Analytics.captureEvent({
        type: `${task}Project`,
        platform: c.platform
    });
    return TASKS[task](c);
};

export default {
    runTask
};
