import {
    RnvTaskFn,
    logTask,
    logError,
    RnvTaskOptionPresets,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { runWebNext } from '../sdk/runner';
import { openBrowser, waitForHost } from '@rnv/sdk-utils';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForHost()
            .then(() => openBrowser(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    if (!parentTask) {
        await executeTask(RnvTaskName.configure, RnvTaskName.start, originTask);
    }

    if (shouldSkipTask(RnvTaskName.start, originTask)) return true;

    if (hosted) {
        return Promise.reject('This platform does not support hosted mode');
    }

    return runWebNext();
};

const Task: RnvTask = {
    description: 'Starts bundler / server',
    fn,
    task: RnvTaskName.start,
    options: RnvTaskOptionPresets.withConfigure(),
    platforms: SdkPlatforms,
};

export default Task;
