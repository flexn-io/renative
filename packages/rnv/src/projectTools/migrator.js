import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

import { askQuestion, generateOptions, finishQuestion } from '../systemTools/prompt';
import { logWarning, logTask, logDebug, logSuccess, logError } from '../systemTools/logger';
import { readObjectSync, mergeObjects, copyFileSync, removeFilesSync, writeObjectSync } from '../systemTools/fileutils';
import { listAppConfigsFoldersSync } from '../configTools/configParser';
import { cleanProjectModules } from '../systemTools/cleaner';
import { configureNodeModules } from './projectParser';

export const checkAndMigrateProject = c => new Promise((resolve, reject) => {
    logTask('checkAndMigrateProject');
    const prjDir = c.paths.project.dir;


    const paths = {
        project: prjDir,
        globalConfig: path.join(c.paths.GLOBAL_RNV_DIR, 'config.json'),
        // privateProjectConfig: path.join(c.paths.private.project.dir, 'config.json'),
        // privateProjectConfig2: path.join(c.paths.private.project.dir, 'config.private.json'),
        // privateProjectConfigNew: path.join(c.paths.private.project.dir, 'renative.private.json'),
        config: path.join(prjDir, 'rnv-config.json'),
        configNew: path.join(prjDir, 'renative.json'),
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
                        .then(() => _migrateProjectSoft(c, paths))
                        .then(() => cleanProjectModules(c))
                        .then(() => configureNodeModules(c))
                        .then(() => resolve())
                        .catch(e => reject(e));
                    return;
                }
                return resolve();
            })
            .catch(e => reject(e));
    } else {
        _migrateProjectSoft(c, paths).then(() => resolve()).catch(e => reject(e));
    }
});

const PATH_PROPS = [
    { oldKey: 'globalConfigFolder', newKey: 'globalConfigDir' },
    { oldKey: 'appConfigsFolder', newKey: 'appConfigsDir' },
    { oldKey: 'platformTemplatesFolder', newKey: 'platformTemplatesDir' },
    { oldKey: 'entryFolder', newKey: 'entryDir' },
    { oldKey: 'platformAssetsFolder', newKey: 'platformAssetsDir' },
    { oldKey: 'platformBuildsFolder', newKey: 'platformBuildsDir' },
    { oldKey: 'projectConfigFolder', newKey: 'projectConfigDir' },
];

const _migrateProjectSoft = (c, paths) => new Promise((resolve, reject) => {
    logTask('_migrateProjectSoft');

    try {
        let requiresSave = false;
        const files = {
            configNew: readObjectSync(paths.configNew),
            // privateProjectConfig: readObjectSync(paths.privateProjectConfig),
        };

        if (files.configNew?.paths) {
            PATH_PROPS.forEach((v) => {
                if (files.configNew.paths[v.oldKey]) {
                    logWarning(`You use old key ${chalk.white(v.oldKey)} instead of new one: ${chalk.white(v.newKey)}. ReNative will try to fix it for you!`);
                    files.configNew.paths[v.newKey] = files.configNew.paths[v.oldKey];
                    delete files.configNew.paths[v.oldKey];
                    requiresSave = true;
                }
            });
        }
        if (requiresSave) writeObjectSync(paths.configNew, files.configNew);

        // _migrateFile(paths.privateProjectConfig, paths.privateProjectConfigNew);
        // _migrateFile(paths.privateProjectConfig2, paths.privateProjectConfigNew);
    } catch (e) {
        logError(`Migration not successfull. ${e}`);
    }

    resolve();
});

const _migrateFile = (oldPath, newPath) => {
    if (!fs.existsSync(newPath)) {
        if (fs.existsSync(oldPath)) {
            logWarning(`Found old app config at ${chalk.white(oldPath)}. will copy to ${chalk.white(newPath)}`);
        }
        copyFileSync(oldPath, newPath);
    }
};

const _migrateProject = (c, paths) => new Promise((resolve, reject) => {
    logTask('MIGRATION STARTED');

    if (!fs.existsSync(c.paths.private.config)) {
        if (fs.existsSync(paths.globalConfig)) {
            copyFileSync(paths.globalConfig, c.paths.private.config);
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

        newConfig.templates = {};

        if (newConfig.defaults.template) {
            newConfig.templates[newConfig.defaults.template] = {
                version: c.files.rnv.package.version
            };
        }

        delete newConfig.defaults.template;

        newConfig.paths = {};
        PATH_PROPS.forEach((v) => {
            if (files.config[v.oldKey]) {
                newConfig.paths[v.newKey] = files.config[v.oldKey];
            }
        });
        newConfig.paths.appConfigDirs = [newConfig.paths.appConfigDir];
        delete newConfig.paths.appConfigDir;

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
