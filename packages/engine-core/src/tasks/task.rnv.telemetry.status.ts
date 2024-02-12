import { chalk, logTask, logToSummary, PARAMS, RnvTask, RnvTaskFn } from '@rnv/core';

export const taskRnvTelemetryStatus: RnvTaskFn = async (c) => {
    logTask('taskRnvTelemetryStatus');

    const disableTelemetry = c.files.defaultWorkspace.config?.disableTelemetry;

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
    fn: taskRnvTelemetryStatus,
    task: 'telemetry status',
    params: PARAMS.withBase(),
    platforms: [],
    isGlobalScope: true,
};

export default Task;
