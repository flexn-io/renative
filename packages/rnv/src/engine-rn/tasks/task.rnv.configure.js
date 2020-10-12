import { logErrorPlatform } from '../../core/platformManager';
import { logTask } from '../../core/systemManager/logger';
import { jetifyIfRequired } from '../../core/systemManager/npmUtils';
import { IOS,
    TVOS,
    ANDROID,
    ANDROID_TV,
    ANDROID_WEAR,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE,
    PARAMS } from '../../core/constants';
import { configureXcodeProject } from '../../sdk-xcode';
import { configureGradleProject } from '../../sdk-android';
import { configureMetroConfigs } from '../commonEngine';
import { executeTask } from '../../core/engineManager';

export const taskRnvConfigure = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await configureMetroConfigs(c, c.platform);
    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case IOS:
        case TVOS:
            await configureXcodeProject(c);
            return true;
        case ANDROID:
        case ANDROID_TV:
        case ANDROID_WEAR:
            await configureGradleProject(c);
            await jetifyIfRequired(c);
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
    platforms: [
        IOS,
        TVOS,
        ANDROID,
        ANDROID_TV,
        ANDROID_WEAR,
    ],
};
