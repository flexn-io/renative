import {
    chalk,
    logToSummary,
    logTask,
    generatePlatformChoices,
    executeTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const taskPlatformList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskPlatformList');

    await executeTask(c, RnvTaskName.projectConfigure, RnvTaskName.platformList, originTask);

    const opts = generatePlatformChoices(c).map((v, i) => ` [${chalk().white(i + 1)}]> ${v.name}`);
    logToSummary(`Platforms:\n\n${opts.join('\n')}`);
    return true;
};

const Task: RnvTask = {
    description: 'List all available platforms',
    fn: taskPlatformList,
    task: RnvTaskName.platformList,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
};

export default Task;
