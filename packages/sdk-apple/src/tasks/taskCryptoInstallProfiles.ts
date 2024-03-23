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
    RnvTaskOptionPresets,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskCryptoInstallProfiles');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.cryptoInstallProfiles, originTask);

    if (shouldSkipTask(RnvTaskName.cryptoInstallProfiles, originTask)) return true;

    const ppFolder = path.join(c.paths.user.homeDir, 'Library/MobileDevice/Provisioning Profiles');

    if (!fsExistsSync(ppFolder)) {
        logWarning(`folder ${ppFolder} does not exist!`);
        mkdirSync(ppFolder);
    }

    const list = getFileListSync(c.paths.workspace.project.dir);
    const mobileprovisionArr = list.filter((v) => v.endsWith('.mobileprovision'));

    try {
        mobileprovisionArr.forEach((v) => {
            logDebug(`taskCryptoInstallProfiles: Installing: ${v}`);
            copyFileSync(v, ppFolder);
        });
    } catch (e) {
        logError(e);
    }

    return true;
};

const Task: RnvTask = {
    description: 'Installs provisioning certificates found in your workspace (mac only)',
    fn,
    task: RnvTaskName.cryptoInstallProfiles,
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['ios', 'macos', 'tvos'],
    // skipPlatforms: true,
};

export default Task;