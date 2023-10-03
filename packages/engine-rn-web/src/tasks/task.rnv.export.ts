import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    WEB,
    TIZEN,
    WEBOS,
    TIZEN_MOBILE,
    TIZEN_WATCH,
    KAIOS,
    FIREFOX_OS,
    FIREFOX_TV,
    CHROMECAST,
    TASK_BUILD,
    TASK_EXPORT,
    PARAMS,
    executeOrSkipTask,
    shouldSkipTask,
} from '@rnv/core';
import { exportWeb } from '@rnv/sdk-webpack';

export const taskRnvExport: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);

    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    if (shouldSkipTask(c, TASK_EXPORT, originTask)) return true;

    switch (platform) {
        case WEB:
            return exportWeb();
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: TASK_EXPORT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [WEB, TIZEN, WEBOS, TIZEN_MOBILE, TIZEN_WATCH, KAIOS, FIREFOX_OS, FIREFOX_TV, CHROMECAST],
};
