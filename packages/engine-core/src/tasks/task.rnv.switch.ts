import {
    logTask,
    configureFonts,
    copyRuntimeAssets,
    generateRuntimeConfig,
    executeTask,
    TASK_SWITCH,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTaskFn,
} from 'rnv';

export const taskRnvSwitch: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvSwitch');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_SWITCH, originTask);

    await copyRuntimeAssets(c);
    await generateRuntimeConfig(c);
    await configureFonts(c);

    return true;
};

export default {
    description: '',
    fn: taskRnvSwitch,
    task: TASK_SWITCH,
    params: PARAMS.withBase(),
    platforms: [],
};
