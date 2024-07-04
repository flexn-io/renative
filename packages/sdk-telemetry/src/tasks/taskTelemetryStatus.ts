import { chalk, logToSummary, createTask, RnvTaskName } from '@rnv/core';

export default createTask({
    description: 'Show current rnv telemetry status on your machine',
    fn: async ({ ctx }) => {
        const disableTelemetry = ctx.files.dotRnv.config?.workspace?.disableTelemetry;

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
    },
    task: RnvTaskName.telemetryStatus,
    isGlobalScope: true,
});
