import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    logRaw,
    TIZEN,
    WEBOS,
    TASK_RUN,
    TASK_CONFIGURE,
    PARAMS,
    executeOrSkipTask,
} from '@rnv/core';
import { runLightningProject } from '../sdks/sdk-lightning';

export const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TASK_CONFIGURE, TASK_RUN, originTask);

    switch (platform) {
        case TIZEN:
        case WEBOS:
            return runLightningProject(c);
        default:
            return logErrorPlatform(c);
    }
};

export const taskRnvRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task = {
    description: 'Run your app on target device or emulator',
    fn: taskRnvRun,
    fnHelp: taskRnvRunHelp,
    task: 'run',
    dependencies: {
        before: TASK_CONFIGURE,
    },
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: [TIZEN, WEBOS],
};

export default Task;
