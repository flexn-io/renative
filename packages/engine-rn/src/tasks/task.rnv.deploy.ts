import { TaskManager, Constants, Logger, RnvTaskFn } from 'rnv';

const { logTask } = Logger;
const { TASK_EXPORT, TASK_DEPLOY, IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR, PARAMS } = Constants;
const { executeOrSkipTask, shouldSkipTask } = TaskManager;

export const taskRnvDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    if (shouldSkipTask(c, TASK_DEPLOY, originTask)) return true;

    // Deploy simply trggets hook
    return true;
};

export default {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: TASK_DEPLOY,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
};
