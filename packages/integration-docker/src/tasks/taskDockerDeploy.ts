import {
    RnvTaskFn,
    logTask,
    executeOrSkipTask,
    initializeTask,
    findSuitableTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import Docker from '../docker';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskDockerDeploy', `parent:${parentTask}`);

    if (c.program.opts().only) {
        // If run as standalone command skip all the export
        await executeOrSkipTask(RnvTaskName.export, 'docker export', originTask);
    } else {
        const taskInstance = await findSuitableTask(RnvTaskName.export);
        if (taskInstance) await initializeTask(taskInstance);
    }

    const docker = new Docker();
    await docker.doDeploy();
    return true;
};

const Task: RnvTask = {
    description: 'Deploys your project to docker image',
    fn,
    task: 'docker deploy',
    platforms: ['web'],
};

export default Task;
