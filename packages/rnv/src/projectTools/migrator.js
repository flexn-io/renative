import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { logWarning, logTask, logDebug, logSuccess, logError } from '../systemTools/logger';
import { readObjectSync, mergeObjects, copyFileSync, removeFilesSync, writeFileSync, copyFolderContentsRecursiveSync, removeDirs } from '../systemTools/fileutils';
import { listAppConfigsFoldersSync } from '../configTools/configParser';
import { rnvClean } from '../systemTools/cleaner';
import { RN_CLI_CONFIG_NAME } from '../constants';
import { configureNodeModules } from './projectParser';
import { inquirerPrompt } from '../systemTools/prompt';

export const checkAndMigrateProject = async (c) => {
    logTask('checkAndMigrateProject');
    const prjDir = c.paths.project.dir;


    const paths = {
        project: prjDir,
        globalConfig: path.join(c.paths.GLOBAL_RNV_DIR, 'config.json'),
        // privateProjectConfig: path.join(c.paths.workspace.project.dir, 'config.json'),
        // privateProjectConfig2: path.join(c.paths.workspace.project.dir, 'config.private.json'),
        // privateProjectConfigNew: path.join(c.paths.workspace.project.dir, 'renative.private.json'),
        projectConfigDir: path.join(prjDir, 'projectConfig'),
        config: path.join(prjDir, 'rnv-config.json'),
        configNew: path.join(prjDir, 'renative.json'),
        package: path.join(prjDir, 'package.json'),
        plugins: path.join(prjDir, 'projectConfig/plugins.json'),
        permissions: path.join(prjDir, 'projectConfig/permissions.json'),
        appConfigs: path.join(prjDir, 'appConfigs'),
        metroConfig: path.join(prjDir, 'rn-cli.config.js'),
        metroConfigNew: path.join(prjDir, RN_CLI_CONFIG_NAME)
    };

    try {
        paths.appConfigDirs = listAppConfigsFoldersSync(c).map(v => `${prjDir}/appConfigs/${v}/config.json`);
    } catch (e) {
        logWarning(e);
    }

    if (fs.existsSync(paths.config)) {
        if (c.program.ci) {
            return Promise.reject('Your project has been created with previous version of ReNative');
        }
        const { confirm } = await inquirer.prompt({
            name: 'confirm',
            type: 'confirm',
            message: 'Your project has been created with previous version of ReNative. Do you want to migrate it to new format? Backing up project is recommended!'
        });

        if (confirm) {
            c.program.reset = true;
            await _migrateProject(c, paths);
            await _migrateProjectSoft(c, paths);
            await rnvClean(c);
            await configureNodeModules(c);
            return true;
        }
    } else {
        await _migrateProjectSoft(c, paths);
    }
    return true;
};

const PATH_PROPS = [
    { oldKey: 'globalConfigFolder', newKey: 'globalConfigDir' },
    { oldKey: 'appConfigsFolder', newKey: 'appConfigsDir' },
    { oldKey: 'platformTemplatesFolder', newKey: 'platformTemplatesDir' },
    { oldKey: 'entryFolder', newKey: 'entryDir' },
    { oldKey: 'platformAssetsFolder', newKey: 'platformAssetsDir' },
    { oldKey: 'platformBuildsFolder', newKey: 'platformBuildsDir' },
    { oldKey: 'projectConfigFolder', newKey: 'projectConfigDir' },
];

const _migrateProjectSoft = async (c, paths) => {
    logTask('_migrateProjectSoft');
    let files;
    try {
        let requiresSave = false;
        files = {
            configNew: fs.existsSync(paths.configNew) ? readObjectSync(paths.configNew) : null,
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

        if (fs.existsSync(paths.package)) {
            const packageString = fs.readFileSync(paths.package).toString();
            if (!packageString.includes('jetify') && !packageString.includes('postinstall')) {
                logWarning(`You're missing ${chalk.white('"scripts": { "postinstall": "jetify" }')} in your package.json. Your android build might fail!`);
            }
        }

        if (fs.existsSync(paths.metroConfig)) {
            logWarning(`Found deprecated metro config ${paths.metroConfig} and it needs to be migrated to ${paths.metroConfigNew}. ReNative will try to fix it for you!`);
            const metroConfig = fs.readFileSync(paths.metroConfig).toString();
            fs.writeFileSync(paths.metroConfigNew, metroConfig);
            removeFilesSync([paths.metroConfig]);
        }

        if (files.configNew?.android) {
            logWarning('Found legacy object "android" at root. ReNative will try to fix it for you!');
            files.configNew.platforms = files.configNew.platforms || {};

            files.configNew.platforms.android = mergeObjects(c, files.configNew.platforms.android || {}, files.configNew.android);
            if (files.configNew.platforms.androidtv) {
                files.configNew.platforms.androidtv = mergeObjects(c, files.configNew.platforms.androidtv || {}, files.configNew.android);
            }
            if (files.configNew.platforms.androidwear) {
                files.configNew.platforms.androidwear = mergeObjects(c, files.configNew.platforms.androidwear || {}, files.configNew.android);
            }
            delete files.configNew.android;
            requiresSave = true;
        }

        if (files.configNew?.ios) {
            logWarning('Found legacy object "ios" at root. ReNative will try to fix it for you!');
            files.configNew.platforms = files.configNew.platforms || {};
            files.configNew.platforms.ios = mergeObjects(c, files.configNew.platforms.ios || {}, files.configNew.ios);
            if (files.configNew.platforms.tvos) {
                files.configNew.platforms.tvos = mergeObjects(c, files.configNew.platforms.tvos || {}, files.configNew.ios);
            }
            delete files.configNew.ios;
            requiresSave = true;
        }

        if (fs.existsSync(paths.permissions)) {
            logWarning(`Found legacy object ${chalk.red(paths.permissions)}. this should be migrated to ${chalk.green('./renative.json')}`);
        }

        if (fs.existsSync(paths.plugins)) {
            logWarning(`Found legacy object ${chalk.red(paths.plugins)}. this should be migrated to ${chalk.green('./renative.json')}`);
        }

        if (requiresSave) writeFileSync(paths.configNew, files.configNew);

        if (fs.existsSync(paths.projectConfigDir)) {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: 'in RNV 0.28.12+ ./projectConfig has been migrated to ./appConfigs/base. confirm to migrate to new structure. (having a backup or clean git status is recommended)'
            });

            if (confirm) {
                copyFolderContentsRecursiveSync(paths.projectConfigDir, c.paths.project.projectConfig.dir);

                await removeDirs([paths.projectConfigDir]);
            } else {
                logError('Not migrating ./projectConfig will most likely result in errors');
            }
        }

        // _migrateFile(paths.privateProjectConfig, paths.privateProjectConfigNew);
        // _migrateFile(paths.privateProjectConfig2, paths.privateProjectConfigNew);
    } catch (e) {
        logError(`Migration not successfull. ${e}`);
    }
};

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

    if (!fs.existsSync(c.paths.workspace.config)) {
        if (fs.existsSync(paths.globalConfig)) {
            copyFileSync(paths.globalConfig, c.paths.workspace.config);
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
            newConfig.defaults = mergeObjects(c, newConfig.defaults, files.config.defaultProjectConfigs);
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

    writeFileSync(c.paths.project.config, newConfig);

    logDebug(`Paths to delete, ${pathsToDelete.join('\n')}`);

    removeFilesSync(pathsToDelete);

    logSuccess('Migration Complete!');

    resolve();
});
