import { TaskManager, Constants, Logger, PlatformManager, RnvTaskFn } from '@rnv/core';
import { exportXcodeProject } from '@rnv/sdk-apple';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { MACOS, TASK_BUILD, TASK_EXPORT, PARAMS } = Constants;

const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case MACOS:
            return exportXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [MACOS],
};
