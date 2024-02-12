import { chalk, logTask, logToSummary, PARAMS, RnvTask, RnvTaskFn, writeFileSync } from '@rnv/core';

export const taskRnvTelemetryDisable: RnvTaskFn = async (c) => {
    logTask('taskRnvTelemetryDisable');

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
    fn: taskRnvTelemetryDisable,
    task: 'telemetry disable',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
