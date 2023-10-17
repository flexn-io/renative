import {
    RnvContext,
    RnvTaskFn,
    WEB,
    WEBTV,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    CHROMECAST,
    TASK_RUN,
    TASK_START,
    TASK_CONFIGURE,
    PARAMS,
    logErrorPlatform,
    logTask,
    logDebug,
    getConfigProp,
    getPlatformProjectDir,
    existBuildsOverrideForTargetPathSync,
    writeCleanFile,
    executeTask,
    executeOrSkipTask,
    shouldSkipTask,
} from '@rnv/core';
import ip from 'ip';
import path from 'path';
import { runChromecast, runWebpackServer } from '@rnv/sdk-webpack';
import { runTizen } from '@rnv/sdk-tizen';
import { runWebOS } from '@rnv/sdk-webos';
import { runKaiOSProject } from '@rnv/sdk-kaios';

const _configureHostedIfRequired = async (c: RnvContext) => {
    logTask('_configureHostedIfRequired');

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);
    const hostedShellHeaders = getConfigProp(c, c.platform, 'hostedShellHeaders') || '';

    if (!bundleAssets && !existBuildsOverrideForTargetPathSync(c, path.join(getPlatformProjectDir(c)!, 'index.html'))) {
        logDebug('Running hosted build');
        const ipAddress = c.program.hostIp || ip.address();

        writeCleanFile(
            path.join(c.runtime.currentEngine.rootPath!, 'templates', 'appShell', 'index.html'),
            path.join(getPlatformProjectDir(c)!, 'index.html'),
            [
                {
                    pattern: '{{DEV_SERVER}}',
                    override: `http://${ipAddress}:${c.runtime.port}`,
                },
                {
                    pattern: '{{APPSHELL_HTML_HEADER}}',
                    override: String(hostedShellHeaders || ''),
                },
            ],
            undefined,
            c
        );
    }
};

export const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (hosted) {
        c.runtime.shouldOpenBrowser = true;
        // return _taskStart(c);
        return executeTask(c, TASK_START, TASK_RUN, originTask);
    }

    if (shouldSkipTask(c, TASK_RUN, originTask)) return true;

    switch (platform) {
        case WEB:
        case WEBTV:
            c.runtime.shouldOpenBrowser = true;
            return runWebpackServer(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runTizen(c, target);
        case WEBOS:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runWebOS(c);
        case KAIOS:
            return runKaiOSProject(c);
        case CHROMECAST:
            if (!c.program.only) {
                await _configureHostedIfRequired(c);
            }
            return runChromecast(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app in browser',
    fn: taskRnvRun,
    task: TASK_RUN,
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [WEB, WEBTV, TIZEN, WEBOS, TIZEN_MOBILE, TIZEN_WATCH, KAIOS, CHROMECAST],
};
