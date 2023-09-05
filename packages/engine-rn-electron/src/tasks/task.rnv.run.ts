import { Constants, Logger, PlatformManager, RnvTaskFn, TaskManager } from 'rnv';
import { SDKElectron } from '../sdks';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { MACOS, WINDOWS, LINUX, TASK_RUN, TASK_CONFIGURE, PARAMS } = Constants;
const { runElectron } = SDKElectron;
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
        case MACOS:
        case WINDOWS:
        case LINUX:
            return runElectron(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Run your app on target device or emulator',
    fn: taskRnvRun,
    task: TASK_RUN,
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [MACOS, WINDOWS, LINUX],
};
