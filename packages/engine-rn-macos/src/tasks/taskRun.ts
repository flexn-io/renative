import {
    RnvTaskFn,
    getConfigProp,
    logErrorPlatform,
    logTask,
    logSummary,
    logRaw,
    RnvTaskOptionPresets,
    executeOrSkipTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { runXcodeProject } from '@rnv/sdk-apple';
import { startBundlerIfRequired, waitForBundlerIfRequired } from '@rnv/sdk-react-native';

const taskRun: RnvTaskFn = async (c, parentTask, originTask) => {
    const { platform } = c;
    const { port } = c.runtime;
    const { target } = c.runtime;
    const { hosted } = c.program;
    logTask('taskRun', `parent:${parentTask} port:${port} target:${target} hosted:${hosted}`);

    await executeOrSkipTask(RnvTaskName.configure, RnvTaskName.run, originTask);

    if (shouldSkipTask(RnvTaskName.run, originTask)) return true;

    const bundleAssets = getConfigProp('bundleAssets', false);

    switch (platform) {
        case 'macos':
            if (!c.program.only) {
                await startBundlerIfRequired(RnvTaskName.run, originTask);
                await runXcodeProject();
                if (!bundleAssets) {
                    logSummary({ header: 'BUNDLER STARTED' });
                }
                return waitForBundlerIfRequired();
            }
            return runXcodeProject();
        default:
            return logErrorPlatform();
    }
};

const taskRunHelp = async () => {
    logRaw(`
More info at: https://renative.org/docs/api-cli
`);
};

const Task: RnvTask = {
    description: 'Run your macos app on target device or emulator',
    fn: taskRun,
    fnHelp: taskRunHelp,
    task: RnvTaskName.run,
    isPriorityOrder: true,
    // dependencies: {
    //     before: RnvTaskName.configure,
    // },
    options: RnvTaskOptionPresets.withBase(RnvTaskOptionPresets.withConfigure(RnvTaskOptionPresets.withRun())),
    platforms: ['macos'],
};

export default Task;
