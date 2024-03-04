import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    configureEntryPoint,
    executeTask,
    shouldSkipTask,
    jetifyIfRequired,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { configureGradleProject } from '@rnv/sdk-android';
import { configureXcodeProject } from '@rnv/sdk-apple';
import { configureFonts } from '@rnv/sdk-react-native';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(c, TaskKey.platformConfigure, TaskKey.configure, originTask);
    if (shouldSkipTask(c, TaskKey.configure, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'ios':
        case 'macos':
            await configureXcodeProject(c);
            break;
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
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
    fn: taskConfigure,
    task: TaskKey.configure,
    options: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
