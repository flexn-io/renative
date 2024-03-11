import {
    RnvContext,
    RnvTaskFn,
    RnvTaskOptionPresets,
    logErrorPlatform,
    logTask,
    logDebug,
    getConfigProp,
    getPlatformProjectDir,
    writeCleanFile,
    executeTask,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    getAppFolder,
    fsExistsSync,
    getAppConfigBuildsFolder,
    RnvTaskName,
} from '@rnv/core';
import path from 'path';
import { runChromecast, runWebpackServer } from '@rnv/sdk-webpack';
import { runTizen } from '@rnv/sdk-tizen';
import { runWebOS } from '@rnv/sdk-webos';
import { runKaiOSProject } from '@rnv/sdk-kaios';
import { getIP } from '@rnv/sdk-utils';

const existBuildsOverrideForTargetPathSync = (c: RnvContext, destPath: string) => {
    const appFolder = getAppFolder();
    const relativePath = path.relative(appFolder, destPath);
    let result = false;

    const pathsToCheck: Array<string> = [];

    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const bf = getAppConfigBuildsFolder(c, c.platform, v);
            if (bf) pathsToCheck.push();
        });
    }

    for (let i = 0; i < pathsToCheck.length; i++) {
        if (fsExistsSync(path.join(pathsToCheck[i], relativePath))) {
            result = true;
            break;
        }
    }
    return result;
};

const _configureHostedIfRequired = async (c: RnvContext) => {
    logTask('_configureHostedIfRequired');

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    if (!bundleAssets && !existBuildsOverrideForTargetPathSync(c, path.join(getPlatformProjectDir()!, 'index.html'))) {
        logDebug('Running hosted build');
        const ipAddress = c.program.hostIp || getIP();

        if (c.runtime.currentEngine?.rootPath) {
            writeCleanFile(
                path.join(c.runtime.currentEngine.rootPath, 'templates', 'appShell', 'index.html'),
                path.join(getPlatformProjectDir()!, 'index.html'),
                [
                    {
                        pattern: '{{DEV_SERVER}}',
                        override: `http://${ipAddress}:${c.runtime.port}`,
                    },
                ],
                undefined,
                c
            );
        }
    }
};

const taskRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.run, originTask);

    if (hosted) {
        c.runtime.shouldOpenBrowser = true;
        // return _taskStart(c);
        return executeTask(RnvTaskName.start, RnvTaskName.run, originTask);
    }

    if (shouldSkipTask(RnvTaskName.run, originTask)) return true;

    switch (platform) {
        case 'web':
        case 'webtv':
            c.runtime.shouldOpenBrowser = true;
            return runWebpackServer();
        case 'tizen':
        case 'tizenmobile':
        case 'tizenwatch':
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runTizen(c, target);
        case 'webos':
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runWebOS(c);
        case 'kaios':
            return runKaiOSProject();
        case 'chromecast':
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runChromecast(c);
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Run your app in browser',
    fn: taskRun,
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun())),
    platforms: ['web', 'webtv', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;
