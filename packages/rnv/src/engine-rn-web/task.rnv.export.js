import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
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
    TASK_EXPORT
} from '../core/constants';
import { exportWeb } from '../sdk-webpack';
import { executeTask } from '../core/engineManager';

export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);

    const { platform } = c;

    await executeTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case WEB:
            return exportWeb(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: 'export',
    params: [],
    platforms: [
        WEB,
        TIZEN,
        WEBOS,
        TIZEN_MOBILE,
        TIZEN_WATCH,
        KAIOS,
        FIREFOX_OS,
        FIREFOX_TV,
        CHROMECAST,
    ],
};
