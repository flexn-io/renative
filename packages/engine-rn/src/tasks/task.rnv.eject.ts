import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    TASK_PACKAGE,
    RnvTask,
} from '@rnv/core';
import { ejectGradleProject } from '@rnv/sdk-android';
import { ejectXcodeProject } from '@rnv/sdk-apple';
import { TASK_EJECT } from './constants';

export const taskRnvEject: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvEject');
    const { platform } = c;

    c.runtime._platformBuildsSuffix = '_eject';

    switch (platform) {
        case 'android':
        case 'androidtv':
        case 'androidwear':
            c.runtime._platformBuildsSuffix = '_eject/android';
            break;
        default:
        // Do nothing
    }

    c.runtime._skipNativeDepResolutions = true;

    await executeOrSkipTask(c, TASK_PACKAGE, TASK_EJECT, originTask);

    if (shouldSkipTask(c, TASK_EJECT, originTask)) return true;

    switch (platform) {
        case 'ios':
        case 'macos':
            await ejectXcodeProject(c);
            return true;
        case 'android':
        case 'androidtv':
        case 'androidwear':
            await ejectGradleProject(c);
            return true;
        default:
            await logErrorPlatform(c);
            return true;
    }
};

const Task: RnvTask = {
    description: 'Eject current project app to self contained native project',
    fn: taskRnvEject,
    task: TASK_EJECT,
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
