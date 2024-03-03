import { chalk, logTask, logToSummary, PARAMS, RnvTask, RnvTaskFn, TaskKey, writeFileSync } from '@rnv/core';

const taskRnvTelemetryEnable: RnvTaskFn = async (c) => {
    logTask('taskRnvTelemetryEnable');

    const { config } = c.files.defaultWorkspace;
    if (config) {
        config.disableTelemetry = false;

        writeFileSync(c.paths.GLOBAL_RNV_CONFIG, config);

        logToSummary(`   Succesfully ${chalk().green('enabled')} ReNative telemetry on your machine.
   
   ReNative telemetry is completely anonymous. Thank you for participating!
   Learn more: https://renative.org/telemetry `);
    }

    return true;
};

const Task: RnvTask = {
    description: 'Enables rnv telemetry on your machine',
    fn: taskRnvTelemetryEnable,
    task: TaskKey.telemetryEnable,
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
