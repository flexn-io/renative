import {
    logTask,
    RnvTaskFn,
    configureEntryPoint,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { configureGradleProject } from '../runner';
import { jetifyIfRequired } from '../jetifier';
import { configureFontSources } from '@rnv/sdk-react-native';
import { SdkPlatforms } from '../constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);
    if (shouldSkipTask(RnvTaskName.configure, originTask)) return true;

    await configureEntryPoint(c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    await configureGradleProject();
    await jetifyIfRequired();

    await configureFontSources();
    return true;
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
