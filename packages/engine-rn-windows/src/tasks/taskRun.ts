import {
    logErrorPlatform,
    logTask,
    PARAMS,
    RnvTaskFn,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    TaskKey,
} from '@rnv/core';
import { SDKWindows } from '../sdks';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';

const { ruWindowsProject, clearWindowsTemporaryFiles } = SDKWindows;

const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.run, originTask);

    if (shouldSkipTask(c, TaskKey.run, originTask)) return true;

    switch (platform) {
        case 'xbox':
        case 'windows':
            await clearWindowsTemporaryFiles(c);
            await startBundlerIfRequired(c, TaskKey.run, originTask);
            await ruWindowsProject(c);
            return waitForBundlerIfRequired(c);
        default:
            return logErrorPlatform(c);
    }
};

const Task: RnvTask = {
    description: 'Run your app in a window on desktop',
    fn: taskRnvRun,
    task: TaskKey.run,
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: ['windows', 'xbox'],
};

export default Task;
