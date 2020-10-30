import { TaskManager, Constants, Logger, PlatformManager, WebpackUtils } from 'rnv';

import open from 'better-opn';

const { logErrorPlatform } = PlatformManager;
const { logTask, logError } = Logger;
const {
    MACOS,
    WINDOWS,
    TASK_START,
    TASK_CONFIGURE,
    PARAMS
} = Constants;
const { waitForWebpack, runWebpackServer } = WebpackUtils;
const { executeTask } = TaskManager;

export const taskRnvStart = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { hosted } = c.program;

    logTask('taskRnvStart', `parent:${parentTask} port:${c.runtime.port} hosted:${!!hosted}`);

    if (hosted) {
        waitForWebpack(c)
            .then(() => open(`http://${c.runtime.localhost}:${port}/`))
            .catch(logError);
    }

    if (!parentTask) {
        await executeTask(c, TASK_CONFIGURE, TASK_START, originTask);
    }

    switch (platform) {
        case MACOS:
        case WINDOWS:
            return runWebpackServer(c);
        default:
            return logErrorPlatform(c);
    }
};

export default {
    description: 'Starts bundler / server',
    fn: taskRnvStart,
    task: 'start',
    params: PARAMS.withBase(PARAMS.withConfigure()),
    platforms: [
        MACOS,
        WINDOWS,
    ],
};
