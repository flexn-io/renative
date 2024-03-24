import {
    RnvTaskFn,
    logWarning,
    logTask,
    getFileListSync,
    executeAsync,
    executeTask,
    shouldSkipTask,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';
import { SdkPlatforms } from '../common';

const fn: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskCryptoInstallCerts');

    await executeTask(RnvTaskName.projectConfigure, RnvTaskName.cryptoInstallCerts, originTask);

    if (shouldSkipTask(RnvTaskName.cryptoInstallCerts, originTask)) return true;

    const kChain = c.program.keychain || 'ios-build.keychain';

    const list = getFileListSync(c.paths.workspace.project.dir);
    const cerArr = list.filter((v) => v.endsWith('.cer'));

    try {
        Promise.all(cerArr.map((v) => executeAsync(`security import ${v} -k ${kChain} -A`)));
    } catch (e) {
        logWarning(e);
        return true;
    }
};

const Task: RnvTask = {
    description: 'Installs certificates into keychain (mac only)',
    fn,
    task: RnvTaskName.cryptoInstallCerts,
    platforms: SdkPlatforms,
};

export default Task;
