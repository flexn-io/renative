import { chalk, logTask, logToSummary, RnvTask, RnvTaskFn, RnvTaskName, writeFileSync } from '@rnv/core';

const fn: RnvTaskFn = async (c) => {
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
    fn,
    task: RnvTaskName.telemetryDisable,
    isGlobalScope: true,
};

export default Task;
