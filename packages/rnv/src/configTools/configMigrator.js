import path from 'path';

import { askQuestion, generateOptions, finishQuestion } from '../systemTools/prompt';
import { logWarning, logTask } from '../systemTools/logger';

export const checkAndMigrateConfigs = c => new Promise((resolve, reject) => {
    if (c.buildConfig.schemaVersion !== 2) {
        askQuestion('Your project has been created with previous version of ReNative. Do you want to migrate it to new format? (backing up project is commended)')
            .then((v) => {
                if (v === 'y') {
                    _migrateProject(c)
                        .then(() => resolve())
                        .catch(e => reject(e));
                    return;
                }
                return resolve();
            })
            .catch(e => reject(e));
    } else {
        return resolve();
    }
});

const _migrateProject = c => new Promise((resolve, reject) => {
    logWarning('MIGRATION FEATURE NOT IMPLEMENTED YET!');

    const prjDir = c.paths.project.dir;
    const paths = {
        config: path.join(prjDir, 'config.json'),
        plugins: path.join(prjDir, 'projectConfig/plugins.json'),
        permissions: path.join(prjDir, 'projectConfig/permissions.json'),
        appConfigs: path.join(prjDir, 'appConfigs')
    };

    console.log('paths to migrate:', paths);
});
