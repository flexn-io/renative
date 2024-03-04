import {
    RnvTaskFn,
    logErrorPlatform,
    logTask,
    logRaw,
    executeOrSkipTask,
    RnvTask,
    RnvTaskName,
    RnvTaskOptionPresets,
} from '@rnv/core';
import { runLightningProject } from '../sdks/sdk-lightning';

const taskRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(c, RnvTaskName.configure, RnvTaskName.run, originTask);

    switch (platform) {
        case 'tizen':
        case 'webos':
            return runLightningProject(c);
        default:
            return logErrorPlatform(c);
    }
};

const taskRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task: RnvTask = {
    description: 'Run your lightning app on target device or emulator',
    fn: taskRun,
    fnHelp: taskRunHelp,
    task: RnvTaskName.run,
    // dependencies: {
    //     before: RnvTaskName.configure,
    // },
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun())),
    platforms: ['tizen', 'webos'],
};

export default Task;
