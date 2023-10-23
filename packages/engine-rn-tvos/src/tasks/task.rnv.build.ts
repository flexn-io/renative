import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    TVOS,
    ANDROID_TV,
    FIRE_TV,
    TASK_BUILD,
    TASK_PACKAGE,
    TASK_EXPORT,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
} from '@rnv/core';
import { buildAndroid } from '@rnv/sdk-android';
import { buildXcodeProject } from '@rnv/sdk-apple';

export const taskRnvBuild: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvBuild');
    const { platform } = c;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_BUILD, originTask);

    if (shouldSkipTask(c, TASK_BUILD, originTask)) return true;

    switch (platform) {
        case ANDROID_TV:
        case FIRE_TV:
            return buildAndroid(c);
        case TVOS:
            if (parentTask === TASK_EXPORT) {
                // build task is not necessary when exporting ios
                return true;
            }
            return buildXcodeProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Build project binary',
    fn: taskRnvBuild,
    task: TASK_BUILD,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};
