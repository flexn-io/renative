import {
    RnvTaskFn,
    jetifyIfRequired,
    logErrorPlatform,
    logTask,
    TVOS,
    ANDROID_TV,
    FIRE_TV,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE,
    PARAMS,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
} from '@rnv/core';
import { configureGradleProject } from '@rnv/sdk-android';
import { configureXcodeProject } from '@rnv/sdk-apple';
import { configureMetroConfigs } from '../commonEngine';

export const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await configureMetroConfigs(c);

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case ANDROID_TV:
        case FIRE_TV:
            await configureGradleProject(c);
            await jetifyIfRequired(c);
            return true;
        case TVOS:
            await configureXcodeProject(c);
            return true;
        default:
            await logErrorPlatform(c);
            return true;
    }
};

export default {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: 'configure',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [TVOS, ANDROID_TV, FIRE_TV],
};
