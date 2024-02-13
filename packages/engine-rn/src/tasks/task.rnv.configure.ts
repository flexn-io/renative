import {
    logErrorPlatform,
    logTask,
    TASK_PLATFORM_CONFIGURE,
    TASK_CONFIGURE,
    PARAMS,
    RnvTaskFn,
    configureEntryPoint,
    executeTask,
    shouldSkipTask,
    ANDROID,
    ANDROID_TV,
    FIRE_TV,
    ANDROID_WEAR,
    MACOS,
    IOS,
    jetifyIfRequired,
    RnvTask,
} from '@rnv/core';
import { configureGradleProject } from '@rnv/sdk-android';
import { configureXcodeProject } from '@rnv/sdk-apple';
import { configureFonts } from '@rnv/sdk-react-native';

export const taskRnvConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskRnvConfigure');

    await executeTask(c, TASK_PLATFORM_CONFIGURE, TASK_CONFIGURE, originTask);
    if (shouldSkipTask(c, TASK_CONFIGURE, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case IOS:
        case MACOS:
            await configureXcodeProject(c);
            break;
        case ANDROID:
        case ANDROID_TV:
        case FIRE_TV:
        case ANDROID_WEAR:
            await configureGradleProject(c);
            await jetifyIfRequired(c);
            break;
        default:
            logErrorPlatform(c);
            break;
    }

    await configureFonts(c);
    return true;
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskRnvConfigure,
    task: 'configure',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [IOS, MACOS, ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR],
};

export default Task;
