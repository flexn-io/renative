import { Logger, Constants, TaskManager } from 'rnv';
import Docker from '../docker';

const { logTask } = Logger;
const { PARAMS, WEB, TASK_EXPORT } = Constants;
const { executeOrSkipTask, initializeTask, findSuitableTask } = TaskManager;

export const taskRnvDockerDeploy = async (c, parentTask, originTask) => {
    logTask('taskRnvDockerDeploy', `parent:${parentTask}`);

    if (c.program.only) {
        // If run as standalone command skip all the export
        await executeOrSkipTask(c, TASK_EXPORT, 'docker export', originTask);
    } else {
        const taskInstance = await findSuitableTask(c, TASK_EXPORT);
        await initializeTask(c, taskInstance.task);
    }

    const docker = new Docker(c);
    await docker.doDeploy();
    return true;
};

export default {
    description: 'Deploys your project to docker image',
    fn: taskRnvDockerDeploy,
    task: 'docker deploy',
    params: PARAMS.withBase(),
    platforms: [WEB],
};
