import fs from 'fs';
import path from 'path';

import { askQuestion, generateOptions, finishQuestion } from '../systemTools/prompt';
import { logWarning, logTask, logDebug, logSuccess } from '../systemTools/logger';
import { readObjectSync, mergeObjects, copyFileSync, removeFilesSync, writeObjectSync } from '../systemTools/fileutils';
import { listAppConfigsFoldersSync } from '../configTools/configParser';

export const checkAndMigrateProject = c => new Promise((resolve, reject) => {
    const prjDir = c.paths.project.dir;


    const paths = {
        project: prjDir,
        config: path.join(prjDir, 'rnv-config.json'),
        package: path.join(prjDir, 'package.json'),
        plugins: path.join(prjDir, 'projectConfig/plugins.json'),
        permissions: path.join(prjDir, 'projectConfig/permissions.json'),
        appConfigs: path.join(prjDir, 'appConfigs')
    };

    try {
        paths.appConfigDirs = listAppConfigsFoldersSync(c).map(v => `${prjDir}/appConfigs/${v}/config.json`);
    } catch (e) {
        logWarning(e);
    }

    if (fs.existsSync(paths.config)) {
        askQuestion('Your project has been created with previous version of ReNative. Do you want to migrate it to new format? Backing up project is recommended! To Proceed type: (y)')
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

    const files = {
        config: readObjectSync(paths.config),
        package: readObjectSync(paths.package),
        plugins: readObjectSync(paths.plugins),
        permissions: readObjectSync(paths.permissions)
    };

    console.log('paths to migrate:', paths);

    let newConfig = {};

    if (files.package) {
        newConfig.projectName = files.package.name;
    }

    if (files.config) {
        newConfig = mergeObjects(newConfig, files.config);

        newConfig.defaults = {};

        if (files.defaultProjectConfigs) {
            newConfig.defaults = mergeObjects(newConfig.defaults, files.defaultProjectConfigs);
        }

        newConfig.currentTemplate = newConfig.defaults.template || 'renative-template-hello-world';

        if (files.defaultPorts) {
            newConfig.defaults.ports = files.defaultPorts;
        }

        delete files.defaultProjectConfigs;
        delete files.defaultPorts;
    }

    if (!newConfig.platforms) newConfig.platforms = {};

    if (files.plugins) {
        newConfig.plugins = files.plugins.plugins;

        if (files.plugins.android) {
            newConfig.platforms.android = files.plugins.android;
        }
        if (files.plugins.ios) {
            newConfig.platforms.ios = files.plugins.ios;
        }
    }

    if (files.permissions) {
        newConfig.permissions = files.permissions.permissions;
    }

    const pathsToDelete = [
        paths.config,
        paths.plugins,
        paths.permissions
    ].concat(paths.appConfigDirs);

    paths.appConfigDirs.forEach((v) => {
        if (fs.existsSync(v)) {
            copyFileSync(v, v.replace('/config.json', '/renative.json'));
        }
    });

    writeObjectSync(c.paths.project.config, newConfig);

    logDebug(`Paths to delete, ${pathsToDelete.join('\n')}`);

    removeFilesSync(pathsToDelete);

    logSuccess('Migration Complete!');

    resolve();
});
