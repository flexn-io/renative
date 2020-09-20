import { getEntryFile } from '../core/common';
import { doResolve } from '../core/resolve';
import { logErrorPlatform } from '../core/platformManager';
import { getPlatformExtensions, executeTask } from '../core/engineManager';
import { chalk, logTask, logError, logRaw } from '../core/systemManager/logger';
import { IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_START,
    TASK_CONFIGURE,
    PARAMS } from '../core/constants';
import { executeAsync } from '../core/systemManager/exec';


const BUNDLER_PLATFORMS = {};

BUNDLER_PLATFORMS[IOS] = IOS;
BUNDLER_PLATFORMS[TVOS] = IOS;
BUNDLER_PLATFORMS[ANDROID] = [ANDROID];
BUNDLER_PLATFORMS[ANDROID_TV] = [ANDROID];
BUNDLER_PLATFORMS[ANDROID_WEAR] = [ANDROID];

export const taskRnvStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        return logError(
            'This platform does not support hosted mode',
            true
        );
    }
    if (!parentTask) {
        await executeTask(c, TASK_CONFIGURE, TASK_START, originTask);
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
            } --config=metro.config.js`;

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
            if (!parentTask) {
                return executeAsync(c, startCmd, { stdio: 'inherit', silent: true, env: { RNV_EXTENSIONS: getPlatformExtensions(c) } });
            }
            executeAsync(c, startCmd, { stdio: 'inherit', silent: true, env: { RNV_EXTENSIONS: getPlatformExtensions(c) } });
            return true;
        }
        default:

            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: 'start',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
};
