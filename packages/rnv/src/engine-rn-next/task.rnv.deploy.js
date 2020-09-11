import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    WEB,
    CHROMECAST,
    TASK_EXPORT,
    TASK_DEPLOY,
} from '../core/constants';
import { deployWeb } from '../sdk-webpack';
import { deployWebNext } from '../sdk-webpack/webNext';
import { executeTask } from '../core/engineManager';


export const taskRnvDeploy = async (c, parentTask, originTask) => {
    logTask('taskRnvDeploy', `parent:${parentTask}`);
    const { platform } = c;

    if (c.program.only) {
        return true;
    }

    await executeTask(c, TASK_EXPORT, TASK_DEPLOY, originTask);

    switch (platform) {
        case WEB:
            return deployWebNext(c);
        case CHROMECAST:
            return deployWeb(c);
        default:
            logErrorPlatform(c);
    }
};

export default {
    description: 'Deploy the binary via selected deployment intgeration or buld hook',
    fn: taskRnvDeploy,
    task: 'deploy',
    params: [],
    platforms: [
        WEB,
        CHROMECAST,
    ],
};
