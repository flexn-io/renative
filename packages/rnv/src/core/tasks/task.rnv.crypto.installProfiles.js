import path from 'path';
import {
    logWarning,
    logError,
    logTask,
    logDebug
} from '../systemManager/logger';
import {
    getFileListSync,
    copyFileSync,
    mkdirSync,
    fsExistsSync
} from '../systemManager/fileutils';

export const taskRnvCryptoInstallProfiles = c => new Promise((resolve) => {
    logTask('taskRnvCryptoInstallProfiles');
    if (c.platform !== 'ios') {
        logError(
            `taskRnvCryptoInstallProfiles: platform ${c.platform} not supported`
        );
        resolve();
        return;
    }

    const ppFolder = path.join(
        c.paths.home.dir,
        'Library/MobileDevice/Provisioning Profiles'
    );

    if (!fsExistsSync(ppFolder)) {
        logWarning(`folder ${ppFolder} does not exist!`);
        mkdirSync(ppFolder);
    }

    const list = getFileListSync(c.paths.workspace.project.dir);
    const mobileprovisionArr = list.filter(v => v.endsWith('.mobileprovision'));

    try {
        mobileprovisionArr.forEach((v) => {
            logDebug(`taskRnvCryptoInstallProfiles: Installing: ${v}`);
            copyFileSync(v, ppFolder);
        });
    } catch (e) {
        logError(e);
    }

    resolve();
});

export default {
    description: '',
    fn: taskRnvCryptoInstallProfiles,
    task: 'crypto',
    subTask: 'installProfiles',
    params: [],
    platforms: [],
};
