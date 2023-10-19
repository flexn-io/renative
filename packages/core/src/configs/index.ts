import path from 'path';

import { RENATIVE_CONFIG_NAME, RENATIVE_CONFIG_PRIVATE_NAME, RENATIVE_CONFIG_LOCAL_NAME } from '../constants';
import { mergeObjects, fsExistsSync, fsReaddirSync, getRealPath, readObjectSync, loadFile } from '../system/fs';
import { logTask, logWarning, logDebug } from '../logger';
import { doResolve } from '../system/resolve';
import { RnvContextFileObj, RnvContextPathObj, RnvContext, RnvContextFileKey } from '../context/types';
import { generateRnvConfigPathObj } from '../context/defaults';
import { generateContextPaths } from '../context';
import { generateBuildConfig } from './buildConfig';
import { generateLocalConfig } from './configLocal';
import { getWorkspaceDirPath } from './workspaces';
import { generatePlatformTemplatePaths } from './configProject';
import { ConfigFileTemplates } from '../schema/configFiles/types';

export const loadFileExtended = (
    c: RnvContext,
    fileObj: Record<string, any>,
    pathObj: RnvContextPathObj,
    key: RnvContextFileKey
) => {
    const result = loadFile(fileObj, pathObj, key);
    if (fileObj[key]) {
        fileObj[`${key}_original`] = { ...fileObj[key] };
    }
    const extendsTemplate = fileObj[key]?.extendsTemplate;
    if (key === 'config' && extendsTemplate) {
        // extendsTemplate only applies to standard 'config'
        let currTemplate = c.files.project[key]?.currentTemplate || fileObj[key].currentTemplate;
        if (!currTemplate) {
            if (extendsTemplate.startsWith('@')) {
                currTemplate = extendsTemplate.split('/').slice(0, 2).join('/');
            } else {
                currTemplate = extendsTemplate.split('/').slice(0, 1);
            }
        }
        if (currTemplate) {
            const currTemplateRes = doResolve(currTemplate);
            if (currTemplateRes) {
                let extendsPath;
                if (extendsTemplate.startsWith(currTemplate)) {
                    extendsPath = path.join(currTemplateRes, extendsTemplate.replace(currTemplate, ''));
                } else {
                    extendsPath = path.join(currTemplateRes, extendsTemplate);
                }

                if (fsExistsSync(extendsPath)) {
                    const extendsFile = readObjectSync(extendsPath);

                    fileObj[key] = mergeObjects(c, extendsFile, fileObj[key], false, true);
                    // CLEAN props which should not be inherited
                    delete fileObj[key].isTemplate;
                    delete fileObj[key].tasks;
                } else {
                    logWarning(`You are trying to extend config file with ${extendsPath} does not exists. SKIPPING.`);
                }
            } else {
                logWarning(`Cannot resolve currentTemplate ${currTemplate} `);
            }
        }
    }
    return result;
};

const _loadConfigFiles = (
    c: RnvContext,
    fileObj: RnvContextFileObj<object>,
    pathObj: RnvContextPathObj,
    parseAppConfigs?: boolean
) => {
    // let result = false;
    let extendAppId: string | undefined;

    const extendedFileLoadResult = loadFileExtended(c, fileObj, pathObj, 'config');
    const fileObjConfig = fileObj.config;
    if (fileObjConfig && 'extend' in fileObjConfig && extendedFileLoadResult) {
        extendAppId = (fileObjConfig.extend as string) || extendAppId;
        // result = true;
    }

    //Do not Extend local configs
    // if (loadFileExtended(c, fileObj, pathObj, 'configLocal')) {
    //     extendAppId = fileObj.configLocal?.extend || extendAppId;
    //     result = true;
    // }

    //Do not Extend private configs
    // if (loadFileExtended(c, fileObj, pathObj, 'configPrivate')) {
    //     extendAppId = fileObj?.configPrivate?.extend || extendAppId;
    //     result = true;
    // }

    if (parseAppConfigs) {
        pathObj.dirs = [];
        pathObj.fontsDirs = [];
        pathObj.pluginDirs = [];
        pathObj.configs = [];
        pathObj.configsLocal = [];
        pathObj.configsPrivate = [];

        fileObj.configs = [];
        fileObj.configsLocal = [];
        fileObj.configsPrivate = [];
        const fileObj1: RnvContextFileObj<object> = {
            configs: [],
            configsLocal: [],
            configsPrivate: [],
        };

        // PATH1: appConfigs/base
        const path1 = path.join(pathObj.appConfigsDir, 'base');

        const pathObj1: RnvContextPathObj = {
            ...generateRnvConfigPathObj(),
            config: path.join(path1, RENATIVE_CONFIG_NAME),
            configLocal: path.join(path1, RENATIVE_CONFIG_LOCAL_NAME),
            configPrivate: path.join(path1, RENATIVE_CONFIG_PRIVATE_NAME),
        };
        pathObj.dirs.push(path1);
        pathObj.fontsDirs.push(path.join(path1, 'fonts'));
        pathObj.pluginDirs.push(path.join(path1, 'plugins'));
        pathObj.configs.push(pathObj1.config);
        pathObj.configsPrivate.push(pathObj1.configPrivate);
        pathObj.configsLocal.push(pathObj1.configLocal);
        // FILE1: appConfigs/base
        loadFileExtended(c, fileObj1, pathObj1, 'config');
        loadFileExtended(c, fileObj1, pathObj1, 'configPrivate');
        loadFileExtended(c, fileObj1, pathObj1, 'configLocal');
        if (fileObj1.config) fileObj.configs.push(fileObj1.config);
        if (fileObj1.configPrivate) fileObj.configsPrivate.push(fileObj1.configPrivate);
        if (fileObj1.configLocal) fileObj.configsLocal.push(fileObj1.configLocal);

        if (fsExistsSync(pathObj.appConfigsDir)) {
            const appConfigsDirNames = fsReaddirSync(pathObj.appConfigsDir);
            if (parseAppConfigs && extendAppId && extendAppId !== 'base' && appConfigsDirNames.includes(extendAppId)) {
                const path2 = path.join(pathObj.appConfigsDir, extendAppId);
                const pathObj2: RnvContextPathObj = {
                    ...generateRnvConfigPathObj(),
                    config: path.join(path2, RENATIVE_CONFIG_NAME),
                    configLocal: path.join(path2, RENATIVE_CONFIG_LOCAL_NAME),
                    configPrivate: path.join(path2, RENATIVE_CONFIG_PRIVATE_NAME),
                };
                const fileObj2: RnvContextFileObj<unknown> = {
                    configs: [],
                    configsLocal: [],
                    configsPrivate: [],
                };
                // PATH2: appConfigs/<extendConfig>
                pathObj.dirs.push(path2);
                pathObj.fontsDirs.push(path.join(path2, 'fonts'));
                pathObj.pluginDirs.push(path.join(path2, 'plugins'));
                pathObj.configs.push(pathObj2.config);
                pathObj.configsLocal.push(pathObj2.configLocal);
                pathObj.configsPrivate.push(pathObj2.configPrivate);
                // FILE2: appConfigs/<extendConfig>
                loadFileExtended(c, fileObj2, pathObj2, 'config');
                loadFileExtended(c, fileObj2, pathObj2, 'configPrivate');
                loadFileExtended(c, fileObj2, pathObj2, 'configLocal');

                if (fileObj2.config) fileObj.configs.push(fileObj2.config);
                if (fileObj2.configLocal) fileObj.configsLocal.push(fileObj2.configLocal);
                if (fileObj2.configPrivate) fileObj.configsPrivate.push(fileObj2.configPrivate);
            }
        }

        // PATH3: appConfigs/<appId>
        const path3 = pathObj.dir;
        pathObj.dirs.push(path3);
        pathObj.fontsDirs.push(path.join(path3, 'fonts'));
        pathObj.pluginDirs.push(path.join(path3, 'plugins'));
        pathObj.configs.push(path.join(path3, RENATIVE_CONFIG_NAME));
        pathObj.configsLocal.push(path.join(path3, RENATIVE_CONFIG_LOCAL_NAME));
        pathObj.configsPrivate.push(path.join(path3, RENATIVE_CONFIG_PRIVATE_NAME));
        // FILE3: appConfigs/<appId>
        loadFileExtended(c, fileObj, pathObj, 'config');
        loadFileExtended(c, fileObj, pathObj, 'configPrivate');
        loadFileExtended(c, fileObj, pathObj, 'configLocal');
        if (fileObj.config) fileObj.configs.push(fileObj.config);
        if (fileObj.configPrivate) fileObj.configsPrivate.push(fileObj.configPrivate);
        if (fileObj.configLocal) fileObj.configsLocal.push(fileObj.configLocal);
    }

    generateBuildConfig(c);
    // return result;
};

export const parseRenativeConfigs = async (c: RnvContext) => {
    logTask('parseRenativeConfigs');
    // LOAD ./package.json
    loadFile(c.files.project, c.paths.project, 'package');

    // LOAD ./RENATIVE.*.JSON
    _loadConfigFiles(c, c.files.project, c.paths.project);

    if (c.runtime.appId) {
        c.paths.project.builds.config = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.platform}.json`);
    } else {
        c.paths.project.builds.config = path.join(c.paths.project.builds.dir, `<TBC>_${c.platform}.json`);
    }

    // LOAD ./platformBuilds/RENATIVE.BUILLD.JSON
    loadFile(c.files.project.builds, c.paths.project.builds, 'config');

    // LOAD WORKSPACE /RENATIVE.*.JSON
    const wsDir = getRealPath(c, await getWorkspaceDirPath(c));
    if (wsDir) {
        generateContextPaths(c.paths.workspace, wsDir);
        _loadConfigFiles(c, c.files.workspace, c.paths.workspace);
    }

    // LOAD DEFAULT WORKSPACE
    generateContextPaths(c.paths.defaultWorkspace, c.paths.GLOBAL_RNV_DIR);
    _loadConfigFiles(c, c.files.defaultWorkspace, c.paths.defaultWorkspace);

    // LOAD PROJECT TEMPLATES
    c.files.rnv.projectTemplates.config =
        readObjectSync<ConfigFileTemplates>(c.paths.rnv.projectTemplates.config) || undefined;

    // // LOAD PLUGIN TEMPLATES
    // await loadPluginTemplates(c);

    if (!c.files.project.config) {
        logDebug(`BUILD_CONFIG: c.files.project.config does not exists. path: ${c.paths.project.config}`);
        return;
    }

    // LOAD WORKSPACE /[PROJECT_NAME]/RENATIVE.*.JSON
    if (!c.files.project.config.projectName) {
        return Promise.reject('Your renative.json is missing required property: projectName ');
    }
    generateContextPaths(
        c.paths.workspace.project,
        path.join(c.paths.workspace.dir, c.files.project.config.projectName)
    );
    _loadConfigFiles(c, c.files.workspace.project, c.paths.workspace.project);

    c.paths.workspace.project.appConfigBase.dir = path.join(c.paths.workspace.project.dir, 'appConfigs', 'base');

    generatePlatformTemplatePaths(c);

    if (c.runtime.appId) {
        if (!c.files.appConfig.config) {
            // _generateConfigPaths(
            //     c.paths.appConfig,
            //     path.join(c.paths.project.appConfigsDir, c.runtime.appId)
            // );
            generateContextPaths(c.paths.appConfig, c.runtime.appConfigDir);
            _loadConfigFiles(c, c.files.appConfig, c.paths.appConfig, true);
        }

        const workspaceAppConfigsDir = getRealPath(c, c.buildConfig.workspaceAppConfigsDir);
        c.paths.workspace.project.appConfigsDir =
            workspaceAppConfigsDir || path.join(c.paths.workspace.project.dir, 'appConfigs');

        generateContextPaths(
            c.paths.workspace.appConfig,
            path.join(c.paths.workspace.project.appConfigsDir, c.runtime.appId)
        );

        _loadConfigFiles(c, c.files.workspace.appConfig, c.paths.workspace.appConfig, true);

        loadFile(c.files.project.assets, c.paths.project.assets, 'config');

        // LOAD WORKSPACE /RENATIVE.*.JSON
        const wsPath = await getWorkspaceDirPath(c);
        if (wsPath) {
            const wsPathReal = getRealPath(c, wsPath);
            if (wsPathReal) {
                generateContextPaths(c.paths.workspace, wsPathReal);
                _loadConfigFiles(c, c.files.workspace, c.paths.workspace);
            }
        }

        generateLocalConfig(c);
        generateBuildConfig(c);
    }
};
