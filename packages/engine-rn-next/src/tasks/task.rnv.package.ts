import {
    RnvTaskFn,
    logTask,
    WEB,
    CHROMECAST,
    TASK_PACKAGE,
    TASK_CONFIGURE,
    PARAMS,
    executeOrSkipTask,
} from '@rnv/core';

export const taskRnvPackage: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    return true;
};

export default {
    description: 'Package source files into bundle',
    fn: taskRnvPackage,
    task: 'package',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, CHROMECAST],
};
