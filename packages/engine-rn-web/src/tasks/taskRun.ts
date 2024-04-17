import {
    RnvContext,
    RnvTaskOptionPresets,
    logTask,
    logDebug,
    getConfigProp,
    getPlatformProjectDir,
    writeCleanFile,
    executeTask,
    createTask,
    getAppFolder,
    fsExistsSync,
    getAppConfigBuildsFolder,
    RnvTaskName,
    RnvTaskOptions,
} from '@rnv/core';
import path from 'path';
import { runChromecast, runWebpackServer } from '@rnv/sdk-webpack';
import { runTizen } from '@rnv/sdk-tizen';
import { runWebOS } from '@rnv/sdk-webos';
import { runKaiOSProject } from '@rnv/sdk-kaios';
import { getIP } from '@rnv/sdk-utils';
import { EnginePlatforms } from '../constants';

const existBuildsOverrideForTargetPathSync = (c: RnvContext, destPath: string) => {
    const appFolder = getAppFolder();
    const relativePath = path.relative(appFolder, destPath);
    let result = false;

    const pathsToCheck: Array<string> = [];

    if (c.paths.appConfig.dirs) {
        c.paths.appConfig.dirs.forEach((v) => {
            const bf = getAppConfigBuildsFolder(v);
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

    const bundleAssets = getConfigProp('bundleAssets');

    if (!bundleAssets && !existBuildsOverrideForTargetPathSync(c, path.join(getPlatformProjectDir()!, 'index.html'))) {
        logDebug('Running hosted build');
        const ipAddress = c.program.opts().hostIp || getIP();

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

export default createTask({
    description: 'Run your app in browser',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx, taskName, originTaskName }) => {
        const { hosted } = ctx.program.opts();
        if (hosted) {
            ctx.runtime.shouldOpenBrowser = true;
            // return _taskStart(c);
            return executeTask({ taskName: RnvTaskName.start, parentTaskName: taskName, originTaskName });
        }

        switch (ctx.platform) {
            case 'web':
            case 'webtv':
                ctx.runtime.shouldOpenBrowser = true;
                return runWebpackServer();
            case 'tizen':
            case 'tizenmobile':
            case 'tizenwatch':
                if (!ctx.program.opts().only) {
                    await _configureHostedIfRequired(ctx);
                }
                return runTizen(ctx, ctx.runtime.target);
            case 'webos':
                if (!ctx.program.opts().only) {
                    await _configureHostedIfRequired(ctx);
                }
                return runWebOS(ctx);
            case 'kaios':
                if (!ctx.program.opts().only) {
                    await _configureHostedIfRequired(ctx);
                }
                return runKaiOSProject(ctx);
            case 'chromecast':
                if (!ctx.program.opts().only) {
                    await _configureHostedIfRequired(ctx);
                }
                return runChromecast(ctx);
            default:
            // Do nothing
        }
    },
    task: RnvTaskName.run,
    isPriorityOrder: true,
    // options: [],
    options: [{ key: 'foo', description: 'bar' }],
    platforms: EnginePlatforms,
});
