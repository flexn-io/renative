import { TaskManager, EngineManager, Constants, Logger, PlatformManager, Exec, Common, Resolver } from 'rnv';
import { isBundlerActive } from '../commonEngine';

const { getEntryFile, confirmActiveBundler } = Common;
const { logErrorPlatform } = PlatformManager;
const { generateEnvVars } = EngineManager;
const { executeTask, shouldSkipTask } = TaskManager;
const { chalk, logTask, logError, logRaw, logInfo } = Logger;
const { WINDOWS, XBOX, TASK_START, TASK_CONFIGURE_SOFT, PARAMS } = Constants;
const { executeAsync } = Exec;
const { doResolve } = Resolver;

const BUNDLER_PLATFORMS = {};

BUNDLER_PLATFORMS[WINDOWS] = WINDOWS;
BUNDLER_PLATFORMS[XBOX] = WINDOWS;

export const taskRnvStart = async (c, parentTask, originTask) => {
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
        case XBOX:
        case WINDOWS: {
            let startCmd = `node ${doResolve('react-native')}/local-cli/cli.js start --port ${
                c.runtime.port || 8092
            } --config=metro.config.js`;

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
                `http://${c.runtime.localhost}:${c.runtime.port || 8092}/${getEntryFile(
                    c,
                    c.platform
                )}.bundle?platform=${BUNDLER_PLATFORMS[platform]}`
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
            // child_process_1.spawn('cmd.exe', ['/C', startCmd], { stdio: 'inherit', silent: true, env: { ...generateEnvVars(c) } });
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
    platforms: [WINDOWS, XBOX],
};
