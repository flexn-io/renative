import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_BUILD, TASK_EXPORT,
    PARAMS } from '../../core/constants';
import { exportXcodeProject } from '../../sdk-xcode';
import { executeOrSkipTask } from '../../core/engineManager';


export const taskRnvExport = async (c, parentTask, originTask) => {
    logTask('taskRnvExport', `parent:${parentTask}`);
    const { platform } = c;

    await executeOrSkipTask(c, TASK_BUILD, TASK_EXPORT, originTask);

    switch (platform) {
        case IOS:
        case TVOS:
            return exportXcodeProject(c, platform);
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            // Android Platforms don't need extra export step
            return true;
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Export the app into deployable binary',
    fn: taskRnvExport,
    task: 'export',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
};
