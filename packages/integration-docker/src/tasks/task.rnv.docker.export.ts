import {
    RnvTaskFn,
    logTask,
    PARAMS,
    executeOrSkipTask,
    initializeTask,
    findSuitableTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import Docker from '../docker';

export const taskRnvDockerExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvDockerExport', `parent:${parentTask}`);

    if (c.program.only) {
        // If run as standalone command skip all the export
        await executeOrSkipTask(c, TaskKey.export, 'docker export', originTask);
    } else {
        const taskInstance = await findSuitableTask(c, TaskKey.export);
        if (taskInstance) await initializeTask(c, taskInstance.task);
    }

    const docker = new Docker(c);
    await docker.doExport();
    return true;
};

const Task: RnvTask = {
    description: 'Exports your project to docker image',
    fn: taskRnvDockerExport,
    task: 'docker export',
    params: PARAMS.withBase(),
    platforms: ['web'],
};

export default Task;
