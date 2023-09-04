import { TaskManager, Constants, Logger, PlatformManager, Common, RnvTaskFn } from 'rnv';
import { runXcodeProject } from '@rnv/sdk-apple';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '../commonEngine';

const { getConfigProp } = Common;
const { logErrorPlatform } = PlatformManager;
const { logTask, logSummary, logRaw } = Logger;
const { MACOS, TASK_RUN, TASK_CONFIGURE, PARAMS } = Constants;

const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (shouldSkipTask(c, TASK_RUN, originTask)) return true;

    const bundleAssets = getConfigProp(c, c.platform, 'bundleAssets', false);

    switch (platform) {
        case MACOS:
            if (!c.program.only) {
                await startBundlerIfRequired(c, TASK_RUN, originTask);
                await runXcodeProject(c);
                if (!bundleAssets) {
                    logSummary('BUNDLER STARTED');
                }
                return waitForBundlerIfRequired(c);
            }
            return runXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export const taskRnvRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task = {
    description: 'Run your app on target device or emulator',
    fn: taskRnvRun,
    fnHelp: taskRnvRunHelp,
    task: TASK_RUN,
    dependencies: {
        before: TASK_CONFIGURE,
    },
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [MACOS],
};

export default Task;
