import { Logger, Constants, TaskManager, RnvTaskFn } from 'rnv';
import Docker from '../docker';

const { logTask } = Logger;
const { PARAMS, WEB, TASK_EXPORT } = Constants;
const { executeOrSkipTask, initializeTask, findSuitableTask } = TaskManager;

export const taskRnvDockerExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDockerExport', `parent:${parentTask}`);

    if (c.program.only) {
        // If run as standalone command skip all the export
        await executeOrSkipTask(c, TASK_EXPORT, 'docker export', originTask);
    } else {
        const taskInstance = await findSuitableTask(c, TASK_EXPORT);
        if (taskInstance) await initializeTask(c, taskInstance.task);
    }

    const docker = new Docker(c);
    await docker.doExport();
    return true;
};

export default {
    description: 'Exports your project to docker image',
    fn: taskRnvDockerExport,
    task: 'docker export',
    params: PARAMS.withBase(),
    platforms: [WEB],
};
