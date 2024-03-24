import {
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';
import { clearWindowsTemporaryFiles, ruWindowsProject } from '../sdk';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.run, originTask);

    if (shouldSkipTask(RnvTaskName.run, originTask)) return true;

    await clearWindowsTemporaryFiles(c);
    await startBundlerIfRequired(RnvTaskName.run, originTask);
    await ruWindowsProject(c);
    return waitForBundlerIfRequired();
};

const Task: RnvTask = {
    description: 'Run your app in a window on desktop',
    fn,
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
};

export default Task;
