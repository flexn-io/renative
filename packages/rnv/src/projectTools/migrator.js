import fs from 'fs';
import path from 'path';

import { askQuestion, generateOptions, finishQuestion } from '../systemTools/prompt';
import { logWarning, logTask, logDebug, logSuccess } from '../systemTools/logger';
import { readObjectSync, mergeObjects, copyFileSync, removeFilesSync, writeObjectSync } from '../systemTools/fileutils';
import { listAppConfigsFoldersSync } from '../configTools/configParser';
import { cleanProjectModules } from '../systemTools/cleaner';
import { configureNodeModules } from './projectParser';

export const checkAndMigrateProject = c => new Promise((resolve, reject) => {
    const prjDir = c.paths.project.dir;


    const paths = {
        project: prjDir,
        globalConfig: path.join(c.paths.GLOBAL_RNV_DIR, 'config.json'),
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
                    c.program.reset = true;
                    _migrateProject(c, paths)
                        .then(cleanProjectModules(c))
                        .then(() => configureNodeModules(c))
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

const PATH_PROPS = [
    'globalConfigFolder',
    'appConfigsFolder',
    'platformTemplatesFolder',
    'entryFolder',
    'platformAssetsFolder',
    'platformBuildsFolder',
    'projectPlugins',
    'projectConfigFolder',
];


const _migrateProject = (c, paths) => new Promise((resolve, reject) => {
    logTask('MIGRATION STARTED');

    if (!fs.existsSync(c.paths.GLOBAL_RNV_CONFIG)) {
        if (fs.existsSync(paths.globalConfig)) {
            copyFileSync(paths.globalConfig, c.paths.GLOBAL_RNV_CONFIG);
        }
    }

    const files = {
        config: readObjectSync(paths.config),
        package: readObjectSync(paths.package),
        plugins: readObjectSync(paths.plugins),
        permissions: readObjectSync(paths.permissions)
    };

    logDebug(`paths to migrate: \n ${paths}`);

    const newConfig = {};

    if (files.package) {
        newConfig.projectName = files.package.name;
    }

    if (files.config) {
        newConfig.defaults = {};

        if (files.config.defaultProjectConfigs) {
            newConfig.defaults = mergeObjects(newConfig.defaults, files.config.defaultProjectConfigs);
        }
        newConfig.currentTemplate = newConfig.defaults.template || 'renative-template-hello-world';

        newConfig.paths = {};
        PATH_PROPS.forEach((v) => {
            if (files.config[v]) {
                newConfig.paths[v] = files.config[v];
            }
        });

        if (files.config.defaultPorts) {
            newConfig.defaults.ports = files.config.defaultPorts;
        }

        if (files.config.crypto) {
            newConfig.crypto = files.config.crypto;
        }
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
