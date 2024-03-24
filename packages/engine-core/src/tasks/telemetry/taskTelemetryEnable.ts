import { chalk, logTask, logToSummary, RnvTask, RnvTaskFn, RnvTaskName, writeFileSync } from '@rnv/core';

const fn: RnvTaskFn = async (c) => {
    logTask('taskTelemetryEnable');

    const { config } = c.files.dotRnv;
    if (config) {
        config.disableTelemetry = false;

        writeFileSync(c.paths.dotRnv.config, config);

        logToSummary(`   Succesfully ${chalk().green('enabled')} ReNative telemetry on your machine.
   
   ReNative telemetry is completely anonymous. Thank you for participating!
   Learn more: https://renative.org/telemetry `);
    }

    return true;
};

const Task: RnvTask = {
    description: 'Enables rnv telemetry on your machine',
    fn,
    task: RnvTaskName.telemetryEnable,
    isGlobalScope: true,
};

export default Task;
