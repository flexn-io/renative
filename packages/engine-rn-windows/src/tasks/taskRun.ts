import {
    logErrorPlatform,
    logTask,
    RnvTaskOptionPresets,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { SDKWindows } from '../sdks';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';

const { ruWindowsProject, clearWindowsTemporaryFiles } = SDKWindows;

const taskRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, RnvTaskName.configure, RnvTaskName.run, originTask);

    if (shouldSkipTask(c, RnvTaskName.run, originTask)) return true;

    switch (platform) {
        case 'xbox':
        case 'windows':
            await clearWindowsTemporaryFiles(c);
            await startBundlerIfRequired(c, RnvTaskName.run, originTask);
            await ruWindowsProject(c);
            return waitForBundlerIfRequired(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Run your app in a window on desktop',
    fn: taskRun,
    task: RnvTaskName.run,
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun())),
    platforms: ['windows', 'xbox'],
};

export default Task;
