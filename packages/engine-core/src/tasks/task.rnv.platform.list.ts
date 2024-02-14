import {
    chalk,
    logToSummary,
    logTask,
    generatePlatformChoices,
    executeTask,
    TASK_PLATFORM_LIST,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    RnvTask,
} from '@rnv/core';

export const taskRnvPlatformList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPlatformList');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_PLATFORM_LIST, originTask);

    const opts = generatePlatformChoices(c).map((v, i) => ` [${chalk().white(i + 1)}]> ${v.name}`);
    logToSummary(`Platforms:\n\n${opts.join('\n')}`);
    return true;
};

const Task: RnvTask = {
    description: 'List all available platforms',
    fn: taskRnvPlatformList,
    task: TASK_PLATFORM_LIST,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
