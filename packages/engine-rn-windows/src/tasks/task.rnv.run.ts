import { Constants, Logger, PlatformManager, RnvTaskFn, TaskManager } from 'rnv';
import { SDKWindows } from '../sdks';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '../commonEngine';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { WINDOWS, XBOX, TASK_RUN, TASK_CONFIGURE, PARAMS } = Constants;
const { ruWindowsProject, clearWindowsTemporaryFiles } = SDKWindows;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    if (shouldSkipTask(c, TASK_RUN, originTask)) return true;

    switch (platform) {
        case XBOX:
        case WINDOWS:
            await clearWindowsTemporaryFiles(c);
            await startBundlerIfRequired(c, TASK_RUN, originTask);
            await ruWindowsProject(c);
            return waitForBundlerIfRequired(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app in a window on desktop',
    fn: taskRnvRun,
    task: TASK_RUN,
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [WINDOWS, XBOX],
};
