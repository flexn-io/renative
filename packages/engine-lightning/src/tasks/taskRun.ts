import { RnvTaskFn, logErrorPlatform, logTask, logRaw, PARAMS, executeOrSkipTask, RnvTask, TaskKey } from '@rnv/core';
import { runLightningProject } from '../sdks/sdk-lightning';

const taskRnvRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRnvRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, TaskKey.configure, TaskKey.run, originTask);

    switch (platform) {
        case 'tizen':
        case 'webos':
            return runLightningProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const taskRnvRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task: RnvTask = {
    description: 'Run your lightning app on target device or emulator',
    fn: taskRnvRun,
    fnHelp: taskRnvRunHelp,
    task: TaskKey.run,
    // dependencies: {
    //     before: TaskKey.configure,
    // },
    params: PARAMS.withBase(PARAMS.withConfigure(PARAMS.withRun())),
    platforms: ['tizen', 'webos'],
};

export default Task;
