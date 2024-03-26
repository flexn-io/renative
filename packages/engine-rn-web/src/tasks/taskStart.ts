import { runWebpackServer } from '@rnv/sdk-webpack';
import { getConfigProp, logErrorPlatform, logError, RnvTaskOptionPresets, RnvTask, RnvTaskName } from '@rnv/core';
import { REMOTE_DEBUGGER_ENABLED_PLATFORMS, openBrowser, waitForHost } from '@rnv/sdk-utils';
import { EnginePlatforms } from '../constants';

const Task: RnvTask = {
    description: 'Starts bundler / server',
    dependsOn: [RnvTaskName.configure],
    fn: async ({ ctx }) => {
        const { platform, runtime, program } = ctx;
        const { port, localhost } = runtime;
        const { hosted } = program.opts();

        if (hosted) {
            waitForHost('')
                .then(() => openBrowser(`http://${localhost}:${port}/`))
                .catch(logError);
        }
        const bundleAssets = getConfigProp('bundleAssets');
        const isWeinreEnabled =
            (platform && REMOTE_DEBUGGER_ENABLED_PLATFORMS.includes(platform) && !bundleAssets && !hosted) || undefined;

        switch (platform) {
            case 'web':
            case 'webtv':
            case 'tizen':
            case 'webos':
            case 'tizenmobile':
            case 'tizenwatch':
                return runWebpackServer(isWeinreEnabled);
            default:
                if (hosted) {
                    return Promise.reject('This platform does not support hosted mode');
                }
                return logErrorPlatform();
        }
    },
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: EnginePlatforms,
};

export default Task;
