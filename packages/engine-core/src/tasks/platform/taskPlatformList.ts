import {
    chalk,
    logToSummary,
    logTask,
    generatePlatformChoices,
    executeTask,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const fn: RnvTaskFn = async (_c, _parentTask, originTask) => {
    logTask('taskPlatformList');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.platformList, originTask);

    const opts = generatePlatformChoices().map((v, i) => ` [${chalk().bold(i + 1)}]> ${v.name}`);
    logToSummary(`Platforms:\n\n${opts.join('\n')}`);
    return true;
};

const Task: RnvTask = {
    description: 'List all available platforms',
    fn,
    task: RnvTaskName.platformList,
};

export default Task;
