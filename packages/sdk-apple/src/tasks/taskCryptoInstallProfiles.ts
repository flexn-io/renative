import path from 'path';
import {
    logWarning,
    logError,
    logDebug,
    getFileListSync,
    copyFileSync,
    mkdirSync,
    fsExistsSync,
    createTask,
    RnvTaskName,
} from '@rnv/core';
import { SdkPlatforms } from '../common';

export default createTask({
    description: 'Installs provisioning certificates found in your workspace (mac only)',
    dependsOn: [RnvTaskName.projectConfigure],
    fn: async ({ ctx }) => {
        const ppFolder = path.join(ctx.paths.user.homeDir, 'Library/MobileDevice/Provisioning Profiles');

        if (!fsExistsSync(ppFolder)) {
            logWarning(`folder ${ppFolder} does not exist!`);
            mkdirSync(ppFolder);
        }

        const list = getFileListSync(ctx.paths.workspace.project.dir);
        const mobileprovisionArr = list.filter((v) => v.endsWith('.mobileprovision'));

        try {
            mobileprovisionArr.forEach((v) => {
                logDebug(`taskCryptoInstallProfiles: Installing: ${v}`);
                copyFileSync(v, ppFolder);
            });
        } catch (e) {
            logError(e);
        }
    },
    task: RnvTaskName.cryptoInstallProfiles,
    platforms: SdkPlatforms,
});
