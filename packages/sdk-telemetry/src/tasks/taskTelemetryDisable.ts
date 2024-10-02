import { chalk, logToSummary, createTask, RnvTaskName, writeFileSync } from '@rnv/core';

export default createTask({
    description: 'Disables rnv telemetry on your machine',
    fn: async ({ ctx }) => {
        const { config } = ctx.files.dotRnv;
        if (config) {
            config.workspace.disableTelemetry = true;

            writeFileSync(ctx.paths.dotRnv.config, config);

            logToSummary(`   successfully ${chalk().red('disabled')} ReNative telemetry on your machine.

   No data will be collected from your machine.
   Learn more: https://renative.org/telemetry`);
        }

        return true;
    },
    task: RnvTaskName.telemetryDisable,
    isGlobalScope: true,
});
