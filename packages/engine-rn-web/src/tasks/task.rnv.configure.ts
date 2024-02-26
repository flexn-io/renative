import {
    RnvTaskFn,
    logErrorPlatform,
    copySharedPlatforms,
    logTask,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE,
    PARAMS,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
    RnvTask,
} from '@rnv/core';
import { configureWebProject, configureChromecastProject } from '@rnv/sdk-webpack';
import { configureKaiOSProject } from '@rnv/sdk-kaios';
import { configureWebOSProject } from '@rnv/sdk-webos';
import { configureTizenProject } from '@rnv/sdk-tizen';

export const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;
    await configureEntryPoint(c, c.platform);

    await copySharedPlatforms(c);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'web':
        case 'webtv':
            return configureWebProject(c);
        case 'tizen':
        case 'tizenmobile':
        case 'tizenwatch':
            return configureTizenProject(c);
        case 'webos':
            return configureWebOSProject(c);
        case 'chromecast':
            return configureChromecastProject(c);
        case 'kaios':
            return configureKaiOSProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TASK_CONFIGURE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['web', 'webtv', 'tizen', 'webos', 'tizenmobile', 'tizenwatch', 'kaios', 'chromecast'],
};

export default Task;
