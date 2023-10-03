import {
    logErrorPlatform,
    logTask,
    WINDOWS,
    XBOX,
    PARAMS,
    RnvTaskFn,
    shouldSkipTask,
    TASK_EXPORT,
    TASK_DEPLOY,
    executeOrSkipTask,
} from '@rnv/core';
import { SDKWindows } from '../sdks';

// TODO Implement export windows app (currently it only seems to be available through VS Studio itself...)
const { ruWindowsProject } = SDKWindows;

export const taskRnvDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    if (shouldSkipTask(c, TASK_DEPLOY, originTask)) return true;

    switch (platform) {
        case XBOX:
        case WINDOWS:
            return ruWindowsProject(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: TASK_DEPLOY,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WINDOWS, XBOX],
};
