import {
    logWarning,
    logError,
    logTask
} from '../core/systemManager/logger';
import {
    getFileListSync,
} from '../core/systemManager/fileutils';
import { executeAsync } from '../core/systemManager/exec';

export const taskRnvCryptoInstallCerts = (c, parentTask, originTask) => new Promise((resolve) => {
    logTask('taskRnvCryptoInstallCerts', `parent:${parentTask} origin:${originTask}`);

    if (c.platform !== 'ios') {
        logError(`_installTempCerts: platform ${c.platform} not supported`);
        resolve();
        return;
    }
    const kChain = c.program.keychain || 'ios-build.keychain';

    const list = getFileListSync(c.paths.workspace.project.dir);
    const cerArr = list.filter(v => v.endsWith('.cer'));

    Promise.all(
        cerArr.map(v => executeAsync(c, `security import ${v} -k ${kChain} -A`))
    )
        .then(() => resolve())
        .catch((e) => {
            logWarning(e);
            resolve();
        });
});

export default {
    description: '',
    fn: taskRnvCryptoInstallCerts,
    task: 'crypto installCerts',
    params: [],
    platforms: [],
    skipPlatforms: true,
};
