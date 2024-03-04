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

const taskDockerDeploy: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskDockerDeploy', `parent:${parentTask}`);

    if (c.program.only) {
        // If run as standalone command skip all the export
        await executeOrSkipTask(c, TaskKey.export, 'docker export', originTask);
    } else {
        const taskInstance = await findSuitableTask(c, TaskKey.export);
        if (taskInstance) await initializeTask(c, taskInstance.task);
    }

    const docker = new Docker(c);
    await docker.doDeploy();
    return true;
};

const Task: RnvTask = {
    description: 'Deploys your project to docker image',
    fn: taskDockerDeploy,
    task: 'docker deploy',
    params: PARAMS.withBase(),
    platforms: ['web'],
};

export default Task;
