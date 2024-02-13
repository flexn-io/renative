import path from 'path';
import {
    RnvTaskFn,
    logWarning,
    logError,
    logTask,
    logDebug,
    getFileListSync,
    copyFileSync,
    mkdirSync,
    fsExistsSync,
    executeTask,
    shouldSkipTask,
    TASK_CRYPTO_INSTALL_PROFILES,
    TASK_PROJECT_CONFIGURE,
    PARAMS,
    RnvTask,
} from '@rnv/core';

export const taskRnvCryptoInstallProfiles: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskRnvCryptoInstallProfiles');

    await executeTask(c, TASK_PROJECT_CONFIGURE, TASK_CRYPTO_INSTALL_PROFILES, originTask);

    if (shouldSkipTask(c, TASK_CRYPTO_INSTALL_PROFILES, originTask)) return true;

    if (c.platform !== 'tvos') {
        logError(`taskRnvCryptoInstallProfiles: platform ${c.platform} not supported`);
        return true;
    }

    const ppFolder = path.join(c.paths.home.dir, 'Library/MobileDevice/Provisioning Profiles');

    if (!fsExistsSync(ppFolder)) {
        logWarning(`folder ${ppFolder} does not exist!`);
        mkdirSync(ppFolder);
    }

    const list = getFileListSync(c.paths.workspace.project.dir);
    const mobileprovisionArr = list.filter((v) => v.endsWith('.mobileprovision'));

    try {
        mobileprovisionArr.forEach((v) => {
            logDebug(`taskRnvCryptoInstallProfiles: Installing: ${v}`);
            copyFileSync(v, ppFolder);
        });
    } catch (e) {
        logError(e);
    }

    return true;
};

const Task: RnvTask = {
    description: '',
    fn: taskRnvCryptoInstallProfiles,
    task: TASK_CRYPTO_INSTALL_PROFILES,
    params: PARAMS.withBase(),
    platforms: [],
    // skipPlatforms: true,
};

export default Task;
