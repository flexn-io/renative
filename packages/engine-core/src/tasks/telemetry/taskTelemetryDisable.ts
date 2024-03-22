import {
    chalk,
    logTask,
    logToSummary,
    RnvTaskOptionPresets,
    RnvTask,
    RnvTaskFn,
    RnvTaskName,
    writeFileSync,
} from '@rnv/core';

const taskTelemetryDisable: RnvTaskFn = async (c) => {
    logTask('taskTelemetryDisable');

    const { config } = c.files.dotRnv;
    if (config) {
        config.disableTelemetry = true;

        writeFileSync(c.paths.dotRnv.config, config);

        logToSummary(`   Succesfully ${chalk().red('disabled')} ReNative telemetry on your machine.

   No data will be collected from your machine.
   Learn more: https://renative.org/telemetry`);
    }

    return true;
};

const Task: RnvTask = {
    description: 'Disables rnv telemetry on your machine',
    fn: taskTelemetryDisable,
    task: RnvTaskName.telemetryDisable,
    options: RnvTaskOptionPresets.withBase(),
    platforms: null,
    isGlobalScope: true,
};

export default Task;
