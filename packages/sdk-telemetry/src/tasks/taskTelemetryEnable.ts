import { chalk, logToSummary, createTask, RnvTaskName, writeFileSync } from '@rnv/core';

export default createTask({
    description: 'Enables rnv telemetry on your machine',
    fn: async ({ ctx }) => {
        const { config } = ctx.files.dotRnv;
        if (config) {
            config.disableTelemetry = false;

            writeFileSync(ctx.paths.dotRnv.config, config);

            logToSummary(`   Succesfully ${chalk().green('enabled')} ReNative telemetry on your machine.
   
   ReNative telemetry is completely anonymous. Thank you for participating!
   Learn more: https://renative.org/telemetry `);
        }

        return true;
    },
    task: RnvTaskName.telemetryEnable,
    isGlobalScope: true,
});
