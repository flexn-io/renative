import { RnvTaskFn, logTask, logRaw, executeOrSkipTask, RnvTask, RnvTaskName, RnvTaskOptionPresets } from '@rnv/core';
import { runLightningProject } from '../sdk/runner';
import { SdkPlatforms } from '../sdk/constants';

const fn: RnvTaskFn = async (c, parentTask, originTask) => {
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.run, originTask);

    return runLightningProject();
};

const taskRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task: RnvTask = {
    description: 'Run your lightning app on target device or emulator',
    fn,
    fnHelp: taskRunHelp,
    task: RnvTaskName.run,
    isPriorityOrder: true,
    options: RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun()),
    platforms: SdkPlatforms,
};

export default Task;
