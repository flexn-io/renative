import { TaskManager, Constants, Logger, PlatformManager, NPMUtils, TemplateManager } from 'rnv';
import { configureGradleProject } from '@rnv/sdk-android';
import { ejectXcodeProject } from '@rnv/sdk-apple';
import { configureMetroConfigs } from '../commonEngine';

const { logErrorPlatform } = PlatformManager;
const { logTask } = Logger;
const { jetifyIfRequired } = NPMUtils;
const {
    IOS,
    MACOS,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE,
    PARAMS
} = Constants;


const { executeTask, shouldSkipTask } = TaskManager;
const { configureEntryPoint } = TemplateManager;

export const taskRnvEject = async (c, parentTask, originTask) => {
    logTask('taskRnvEject');

    await configureMetroConfigs(c);

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case IOS:
        case MACOS:
            console.log('BOOOO');
            await ejectXcodeProject(c);
            return true;
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
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
    description: 'Eject current project app to self contained native project',
    fn: taskRnvEject,
    task: 'eject',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        IOS,
        MACOS,
        ANDROID,
        ANDROID_TV,
        FIRE_TV,
        ANDROID_WEAR,
    ],
};
