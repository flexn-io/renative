import { runWebpackServer } from '@rnv/sdk-webpack';
import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    logError,
    RnvTaskOptionPresets,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { openBrowser, waitForHost } from '@rnv/sdk-utils';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForHost('')
            .then(() => openBrowser(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    if (!parentTask) {
        await executeTask(RnvTaskName.configure, RnvTaskName.start, originTask);
    }

    if (shouldSkipTask(RnvTaskName.start, originTask)) return true;

    switch (platform) {
        case 'macos':
        case 'windows':
        case 'linux':
            return runWebpackServer();
        default:
            return logErrorPlatform();
    }
};

const Task: RnvTask = {
    description: 'Starts bundler / server',
    fn,
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
