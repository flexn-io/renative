import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TVOS,
    ANDROID_TV,
    FIRE_TV,
    TASK_BUILD,
    TASK_EXPORT,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
} from '@rnv/core';
import { exportXcodeProject } from '@rnv/sdk-apple';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case ANDROID_TV:
        case FIRE_TV:
            // Android Platforms don't need extra export step
            return true;
        case TVOS:
            return exportXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};
