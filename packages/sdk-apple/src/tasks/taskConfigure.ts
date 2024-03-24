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
import { configureFontSources } from '@rnv/sdk-react-native';
import { configureXcodeProject } from '../runner';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    logTask('taskConfigure');

    await executeTask(RnvTaskName.platformConfigure, RnvTaskName.configure, originTask);
    if (shouldSkipTask(RnvTaskName.configure, originTask)) return true;

    await configureEntryPoint(c.platform);

    if (c.program.only && !!parentTask) {
        return true;
    }

    await configureXcodeProject();
    await configureFontSources();

    return true;
};

const Task: RnvTask = {
    description: 'Configure current project',
    fn,
    task: RnvTaskName.configure,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: ['ios', 'tvos', 'macos'],
};

export default Task;
