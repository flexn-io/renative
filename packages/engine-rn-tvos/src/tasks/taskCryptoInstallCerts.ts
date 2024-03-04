import {
    RnvTaskFn,
    logWarning,
    logError,
    logTask,
    getFileListSync,
    executeAsync,
    executeTask,
    shouldSkipTask,
    PARAMS,
    RnvTask,
    TaskKey,
} from '@rnv/core';

const taskCryptoInstallCerts: RnvTaskFn = async (c, _parentTask, originTask) => {
    logTask('taskCryptoInstallCerts');

    await executeTask(c, TaskKey.projectConfigure, TaskKey.cryptoInstallCerts, originTask);

    if (shouldSkipTask(c, TaskKey.cryptoInstallCerts, originTask)) return true;

    if (c.platform !== 'tvos') {
        logError(`_installTempCerts: platform ${c.platform} not supported`);
        return true;
    }
    const kChain = c.program.keychain || 'ios-build.keychain';

    const list = getFileListSync(c.paths.workspace.project.dir);
    const cerArr = list.filter((v) => v.endsWith('.cer'));

    try {
        Promise.all(cerArr.map((v) => executeAsync(c, `security import ${v} -k ${kChain} -A`)));
    } catch (e) {
        logWarning(e);
        return true;
    }
};

const Task: RnvTask = {
    description: 'Installs certificates into keychain (mac only)',
    fn: taskCryptoInstallCerts,
    task: TaskKey.cryptoInstallCerts,
    options: PARAMS.withBase(),
    platforms: [],
    // skipPlatforms: true,
};

export default Task;
