import fs from 'fs';
import path from 'path';

import { askQuestion, generateOptions, finishQuestion } from '../systemTools/prompt';
import { logWarning, logTask } from '../systemTools/logger';

export const checkAndMigrateProject = c => new Promise((resolve, reject) => {
    const prjDir = c.paths.project.dir;
    const paths = {

        config: path.join(prjDir, 'rnv-config.json'),
        plugins: path.join(prjDir, 'projectConfig/plugins.json'),
        permissions: path.join(prjDir, 'projectConfig/permissions.json'),
        appConfigs: path.join(prjDir, 'appConfigs')
    };

    if (fs.existsSync(paths.config)) {
        askQuestion('Your project has been created with previous version of ReNative. Do you want to migrate it to new format? (backing up project is commended)')
            .then((v) => {
                if (v === 'y') {
                    _migrateProject(c, paths)
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

const _migrateProject = (c, paths) => new Promise((resolve, reject) => {
    logWarning('MIGRATION FEATURE NOT IMPLEMENTED YET!');


    console.log('paths to migrate:', paths);
});
