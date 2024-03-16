import {
    logErrorPlatform,
    logTask,
    RnvTaskFn,
    configureEntryPoint,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { configureGradleProject, jetifyIfRequired } from '@rnv/sdk-android';
import { configureXcodeProject } from '@rnv/sdk-apple';
import { configureFonts } from '@rnv/sdk-react-native';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);
    if (shouldSkipTask(RnvTaskName.configure, originTask)) return true;

    await configureEntryPoint(c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'ios':
        case 'macos':
            await configureXcodeProject();
            break;
        case 'android':
        case 'androidtv':
        case 'firetv':
        case 'androidwear':
            await configureGradleProject();
            await jetifyIfRequired();
            break;
        default:
            logErrorPlatform();
            break;
    }

    await configureFonts();
    return true;
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskConfigure,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['ios', 'android', 'androidtv', 'androidwear', 'macos'],
};

export default Task;
