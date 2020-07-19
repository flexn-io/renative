/* eslint-disable import/no-cycle */
import {
    logWarning,
    logError,
    logTask
} from '../systemManager/logger';
import {
    getFileListSync,
} from '../systemManager/fileutils';
import { executeAsync } from '../systemManager/exec';

export const rnvCryptoInstallCerts = c => new Promise((resolve) => {
    logTask('rnvCryptoInstallCerts');

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
