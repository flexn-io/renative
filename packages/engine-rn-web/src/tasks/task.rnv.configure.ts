import {
    RnvTaskFn,
    logErrorPlatform,
    copySharedPlatforms,
    logTask,
    WEB,
    WEBTV,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    CHROMECAST,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE,
    PARAMS,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
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
        case WEB:
        case WEBTV:
            return configureWebProject(c);
        case TIZEN:
        case TIZEN_MOBILE:
        case TIZEN_WATCH:
            return configureTizenProject(c);
        case WEBOS:
            return configureWebOSProject(c);
        case CHROMECAST:
            return configureChromecastProject(c);
        case KAIOS:
            return configureKaiOSProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: TASK_CONFIGURE,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, WEBTV, TIZEN, WEBOS, TIZEN_MOBILE, TIZEN_WATCH, KAIOS, CHROMECAST],
};
