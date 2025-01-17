import { copyRuntimeAssets, createTask, generatePlatformAssetsRuntimeConfig, RnvTaskName } from '@rnv/core';
import { configureFonts } from '@rnv/sdk-utils';

/**
 * CLI command `npx rnv app create` triggers this task, which facilitates switching between different app configs
 * within the current project.
 *
 * Task Description:
 * - The task is described as "Switch between different app configs in current project".
 *
 * Task Execution Flow:
 * 1. Before Dependencies:
 *    - The `beforeDependsOn` function is executed before the main task dependencies.
 *    - It sets the `appConfigID` option to true in the context's program options.
 *
 * 2. Dependencies:
 *    - The task depends on the `projectConfigure` task, which must be completed before this task can execute.
 *
 * 3. Task Functionality:
 *    - The main function of the task is asynchronous and performs the following actions:
 *      a. Copies runtime assets using the `copyRuntimeAssets` function.
 *      b. Generates platform-specific assets runtime configuration through `generatePlatformAssetsRuntimeConfig`.
 *      c. Configures fonts by invoking the `configureFonts` function.
 *
 * Task Identification:
 * - The task is identified by the name `appSwitch`, which corresponds to the `RnvTaskName.appSwitch`.
 */
export default createTask({
    description: 'Switch between different app configs in current project',
    beforeDependsOn: async ({ ctx }) => {
        ctx.program.opts().appConfigID = true;
    },
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async () => {
        await copyRuntimeAssets();
        await generatePlatformAssetsRuntimeConfig();
        await configureFonts();
    },
    task: RnvTaskName.appSwitch,
});
