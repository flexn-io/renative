import { logErrorPlatform } from '../core/platformManager';
import { logTask } from '../core/systemManager/logger';
import {
    IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_PACKAGE,
    TASK_CONFIGURE
} from '../core/constants';
import {
    packageBundleForXcode
} from '../sdk-xcode';
import {
    packageAndroid,
} from '../sdk-android';

import { executeTask } from '../core/engineManager';


export const taskRnvPackage = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);
    const { platform } = c;

    const target = c.program.target || c.files.workspace.config.defaultTargets[platform];

    await executeTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    switch (platform) {
        case IOS:
        case TVOS:
            return packageBundleForXcode(c);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            return packageAndroid(
                c,
                platform,
                target,
                platform === ANDROID_WEAR
            );
        default:
            logErrorPlatform(c);
            return false;
    }
};

export default {
    description: 'Package JS Code',
    fn: taskRnvPackage,
    task: 'package',
    params: [],
    platforms: [],
};
