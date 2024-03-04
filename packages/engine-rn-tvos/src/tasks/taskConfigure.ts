import {
    RnvTaskFn,
    jetifyIfRequired,
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    executeTask,
    shouldSkipTask,
    configureEntryPoint,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { configureGradleProject } from '@rnv/sdk-android';
import { configureXcodeProject } from '@rnv/sdk-apple';

const taskConfigure: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(c, RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);
    if (shouldSkipTask(c, RnvTaskName.configure, originTask)) return true;

    await configureEntryPoint(c, c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    switch (c.platform) {
        case 'androidtv':
        case 'firetv':
            await configureGradleProject(c);
            await jetifyIfRequired(c);
            return true;
        case 'tvos':
            await configureXcodeProject(c);
            return true;
        default:
            await logErrorPlatform(c);
            return true;
    }
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn: taskConfigure,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure()),
    platforms: ['tvos', 'androidtv', 'firetv'],
};

export default Task;
