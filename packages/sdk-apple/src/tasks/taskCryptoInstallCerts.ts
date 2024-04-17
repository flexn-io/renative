import { logWarning, getFileListSync, executeAsync, createTask, RnvTaskName } from '@rnv/core';
import { SdkPlatforms } from '../common';
import { TaskOptions } from '../taskOptions';

export default createTask({
    description: 'Installs certificates into keychain (mac only)',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const kChain = ctx.program.opts().keychain || 'ios-build.keychain';

        const list = getFileListSync(ctx.paths.workspace.project.dir);
        const cerArr = list.filter((v) => v.endsWith('.cer'));

        try {
            Promise.all(cerArr.map((v) => executeAsync(`security import ${v} -k ${kChain} -A`)));
        } catch (e) {
            logWarning(e);
            return true;
        }
    },
    task: RnvTaskName.cryptoInstallCerts,
    options: [TaskOptions.keychain],
    platforms: SdkPlatforms,
});
