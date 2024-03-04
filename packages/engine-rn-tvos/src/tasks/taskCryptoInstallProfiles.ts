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
    TaskKey,
} from '@rnv/core';

const taskCryptoInstallProfiles: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskCryptoInstallProfiles');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.cryptoInstallProfiles, originTask);

    if (shouldSkipTask(c, TaskKey.cryptoInstallProfiles, originTask)) return true;

    if (c.platform !== 'tvos') {
        logError(`taskCryptoInstallProfiles: platform ${c.platform} not supported`);
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
    fn: taskCryptoInstallProfiles,
    task: TaskKey.cryptoInstallProfiles,
    options: RnvTaskOptionPresets.withBase(),
    platforms: [],
    // skipPlatforms: true,
};

export default Task;
