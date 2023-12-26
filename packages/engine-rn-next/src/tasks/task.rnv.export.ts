import { RnvTaskFn, logTask, WEB, CHROMECAST, TASK_BUILD, TASK_EXPORT, PARAMS, executeOrSkipTask } from '@rnv/core';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    return true;
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, CHROMECAST],
};
