import {
    chalk,
    logToSummary,
    logTask,
    generatePlatformChoices,
    executeTask,
    PARAMS,
    RnvTaskFn,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskRnvPlatformList: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvPlatformList');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.platformList, originTask);

    const opts = generatePlatformChoices(c).map((v, i) => ` [${chalk().white(i + 1)}]> ${v.name}`);
    logToSummary(`Platforms:\n\n${opts.join('\n')}`);
    return true;
};

const Task: RnvTask = {
    description: 'List all available platforms',
    fn: taskRnvPlatformList,
    task: TaskKey.platformList,
    params: PARAMS.withBase(),
    platforms: [],
};

export default Task;
