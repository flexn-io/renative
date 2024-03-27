import { chalk, logToSummary, RnvTask, RnvTaskName, writeFileSync } from '@rnv/core';

const Task: RnvTask = {
    description: 'Disables rnv telemetry on your machine',
    fn: async ({ ctx }) => {
        const { config } = ctx.files.dotRnv;
        if (config) {
            config.disableTelemetry = true;

            writeFileSync(ctx.paths.dotRnv.config, config);

            logToSummary(`   Succesfully ${chalk().red('disabled')} ReNative telemetry on your machine.

   No data will be collected from your machine.
   Learn more: https://renative.org/telemetry`);
        }

        return true;
    },
    task: RnvTaskName.telemetryDisable,
    isGlobalScope: true,
};

export default Task;
