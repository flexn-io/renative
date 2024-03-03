import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    shouldSkipTask,
    executeOrSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { SDKWindows } from '../sdks';

// TODO Implement export windows app (currently it only seems to be available through VS Studio itself...)
const { ruWindowsProject } = SDKWindows;

export const taskRnvDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TaskKey.export, TaskKey.deploy, originTask);

    if (shouldSkipTask(c, TaskKey.deploy, originTask)) return true;

    switch (platform) {
        case 'xbox':
        case 'windows':
            return ruWindowsProject(c);
        default:
            logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: TaskKey.deploy,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['windows', 'xbox'],
};

export default Task;