import { logErrorPlatform } from '../../core/platformManager';
import { checkAndConfigureSdks } from '../../core/sdkManager';
import { logTask } from '../../core/systemManager/logger';
import { PARAMS,
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_WORKSPACE_CONFIGURE, TASK_PROJECT_CONFIGURE } from '../../core/constants';

import { runAppleLog } from '../../sdk-xcode';
import { runAndroidLog } from '../../sdk-android';
import { executeTask } from '../../core/engineManager';

export const taskRnvLog = async (c, parentTask, originTask) => {
    logTask('taskRnvLog', `parent:${parentTask}`);

    await executeTask(c, TASK_WORKSPACE_CONFIGURE, TASK_PROJECT_CONFIGURE, originTask);

    // await checkSdk(c);
    await checkAndConfigureSdks(c);

    switch (c.platform) {
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return runAndroidLog(c);
        case IOS:
        case TVOS:
            return runAppleLog(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Attach logger to device or emulator and print out logs',
    fn: taskRnvLog,
    task: 'log',
    params: PARAMS.withBase(),
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
    isGlobalScope: true
};
