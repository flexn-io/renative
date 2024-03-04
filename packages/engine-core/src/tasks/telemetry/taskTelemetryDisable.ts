import {
    chalk,
    logTask,
    logToSummary,
    RnvTaskOptionPresets,
    RnvTask,
    RnvTaskFn,
    TaskKey,
    writeFileSync,
} from '@rnv/core';

const taskTelemetryDisable: RnvTaskFn = async (c) => {
    logTask('taskTelemetryDisable');

    const { config } = c.files.defaultWorkspace;
    if (config) {
        config.disableTelemetry = true;

        writeFileSync(c.paths.GLOBAL_RNV_CONFIG, config);

        logToSummary(`   Succesfully ${chalk().red('disabled')} ReNative telemetry on your machine.

   No data will be collected from your machine.
   Learn more: https://renative.org/telemetry`);
    }

    return true;
};

const Task: RnvTask = {
    description: 'Disables rnv telemetry on your machine',
    fn: taskTelemetryDisable,
    task: TaskKey.telemetryDisable,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
