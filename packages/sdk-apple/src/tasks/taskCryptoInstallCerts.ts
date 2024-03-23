import {
    RnvTaskFn,
    logWarning,
    logTask,
    getFileListSync,
    executeAsync,
    executeTask,
    shouldSkipTask,
    RnvTaskOptionPresets,
    RnvTask,
    RnvTaskName,
} from '@rnv/core';

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
    options: RnvTaskOptionPresets.withBase(),
    platforms: ['ios', 'macos', 'tvos'],
};

export default Task;
