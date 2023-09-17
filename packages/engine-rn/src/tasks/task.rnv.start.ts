import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeTask,
    shouldSkipTask,
    chalk,
    logInfo,
    logRaw,
    getEntryFile,
    confirmActiveBundler,
    generateEnvVars,
    executeAsync,
    TASK_START,
    TASK_CONFIGURE_SOFT,
    logError,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    MACOS,
    IOS,
} from '@rnv/core';
import { isBundlerActive } from '../commonEngine';

const BUNDLER_PLATFORMS: Record<string, string> = {};

BUNDLER_PLATFORMS[IOS] = IOS;
BUNDLER_PLATFORMS[MACOS] = IOS;
BUNDLER_PLATFORMS[ANDROID] = ANDROID;
BUNDLER_PLATFORMS[ANDROID_TV] = ANDROID;
BUNDLER_PLATFORMS[FIRE_TV] = ANDROID;
BUNDLER_PLATFORMS[ANDROID_WEAR] = ANDROID;

export const taskRnvStart: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        return logError('This platform does not support hosted mode', true);
    }
    // Disable reset for other commands (ie. cleaning platforms)
    c.runtime.disableReset = true;
    if (!parentTask) {
        await executeTask(c, TASK_CONFIGURE_SOFT, TASK_START, originTask);
    }

    if (shouldSkipTask(c, TASK_START, originTask)) return true;

    switch (platform) {
        case IOS:
        case MACOS:
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR: {
            let startCmd = `npx react-native start --port ${c.runtime.port} --no-interactive`;

            if (c.program.resetHard) {
                startCmd += ' --reset-cache';
            } else if (c.program.reset) {
                startCmd += ' --reset-cache';
            }
            if (c.program.resetHard || c.program.reset) {
                logInfo(`You passed ${chalk().white('-r')} argument. --reset-cache will be applied to react-native`);
            }
            // logSummary('BUNDLER STARTED');
            const url = chalk().cyan(
                `http://${c.runtime.localhost}:${c.runtime.port}/${getEntryFile(c, c.platform)}.bundle?platform=${
                    BUNDLER_PLATFORMS[platform]
                }`
            );
            logRaw(`

Dev server running at: ${url}

`);
            if (!parentTask) {
                const isRunning = await isBundlerActive(c);
                let resetCompleted = false;
                if (isRunning) {
                    resetCompleted = await confirmActiveBundler(c);
                }

                if (!isRunning || (isRunning && resetCompleted)) {
                    return executeAsync(c, startCmd, {
                        stdio: 'inherit',
                        silent: true,
                        env: { ...generateEnvVars(c), RCT_NO_LAUNCH_PACKAGER: 1 },
                    });
                }
                if (resetCompleted) {
                    return executeAsync(c, startCmd, {
                        stdio: 'inherit',
                        silent: true,
                        env: { ...generateEnvVars(c) },
                    });
                }

                return true;
            }
            executeAsync(c, startCmd, { stdio: 'inherit', silent: true, env: { ...generateEnvVars(c) } });
            return true;
        }
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: TASK_START,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
};
