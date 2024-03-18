import { chalk, logTask, logToSummary, RnvTaskOptionPresets, RnvTask, RnvTaskFn, RnvTaskName } from '@rnv/core';

const taskTelemetryStatus: RnvTaskFn = async (c) => {
    logTask('taskTelemetryStatus');

    const disableTelemetry = c.files.dotRnv.config?.disableTelemetry;

    if (disableTelemetry) {
        logToSummary(
            `  Status: ${chalk().red('Disabled')}
    
   You have opted-out of ReNative anonymous telemetry program.
   No data will be collected from your machine.
   Learn more: https://renative.org/telemetry`
        );
    } else {
        logToSummary(
            `   Status: ${chalk().green('Enabled')}
    
   ReNative telemetry is completely anonymous. Thank you for participating!
   Learn more: https://renative.org/telemetry `
        );
    }

    return true;
};

const Task: RnvTask = {
    description: 'Show current rnv telemetry status on your machine',
    fn: taskTelemetryStatus,
    task: RnvTaskName.telemetryStatus,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
