import { TaskManager, Constants, Logger } from 'rnv';

const { logTask } = Logger;
const {
    MACOS,
    WINDOWS,
    TASK_EXPORT,
    TASK_DEPLOY,
    PARAMS
} = Constants;

const { executeOrSkipTask } = TaskManager;

export const taskRnvDeploy = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    // Deploy simply trggets hook
    return true;
};

export default {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: 'deploy',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
