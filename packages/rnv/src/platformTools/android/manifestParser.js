import path from 'path';
import os from 'os';
import fs from 'fs';
import net from 'net';
import chalk from 'chalk';
import shell from 'shelljs';
import child_process from 'child_process';
import inquirer from 'inquirer';
import {
    logTask,
    logError,
    getAppFolder,
    isPlatformActive,
    copyBuildsFolder,
    askQuestion,
    finishQuestion,
    CLI_ANDROID_EMULATOR,
    CLI_ANDROID_ADB,
    CLI_ANDROID_AVDMANAGER,
    CLI_ANDROID_SDKMANAGER,
    getAppVersion,
    getAppTitle,
    getAppVersionCode,
    writeCleanFile,
    getAppId,
    getAppTemplateFolder,
    getBuildFilePath,
    getEntryFile,
    logWarning,
    logDebug,
    getConfigProp,
    logInfo,
    getQuestion,
    logSuccess,
    getBuildsFolder,
} from '../../common';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync } from '../../systemTools/fileutils';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';

const _findChildNode = (tag, name, manifestObj) => {
    for (let i = 0; i < manifestObj.children.length; i++) {
        const ch = manifestObj.children[i];
        if (ch.tag === tag) {
            if ((ch.parameters && ch.parameters['android:name'] === name) || PROHIBITED_DUPLICATE_TAGS.includes(tag)) return ch;
        }
    }
    return null;
};

const _convertToXML = manifestObj => _parseNode(manifestObj, 0);

const _parseNode = (n, level) => {
    let output = '';
    let space = '';
    for (let i = 0; i < level; i++) {
        space += '    ';
    }
    let isSingleLine = true;

    if (n.parameters) {
        isSingleLine = Object.keys(n.parameters).length < 2;
        const endLine = isSingleLine ? ' ' : '\n';
        output += `${space}<${n.tag}${endLine}`;
        for (const k in n.parameters) {
            output += `${isSingleLine ? '' : `${space}  `}${k}="${n.parameters[k]}"${endLine}`;
        }
    } else {
        output += `${space}<${n.tag}`;
    }
    if (n.children && n.children.length) {
        if (n.parameters) {
            output += `${isSingleLine ? '' : space}>\n`;
        } else {
            output += '>\n';
        }

        const nextLevel = level += 1;
        n.children.forEach((v) => {
            output += _parseNode(v, nextLevel);
        });
        output += `${space}</${n.tag}>\n`;
    } else {
        output += `${isSingleLine ? '' : space}/>\n`;
    }
    return output;
};

const _mergeNodeParameters = (node, nodeParamsExt) => {
    if (!nodeParamsExt) return;

    if (node) {
        if (!node.parameters) node.parameters = {};
    }
    const nodeParams = node.parameters;
    node.parameters = { ...nodeParams, ...nodeParamsExt };
};

const PROHIBITED_DUPLICATE_TAGS = ['intent-filter'];

const _mergeNodeChildren = (node, nodeChildrenExt) => {
    console.log('_mergeNodeChildren');
    if (!node.children) node.children = [];
    nodeChildrenExt.forEach((v) => {
        const nameExt = v.parameters ? v.parameters['android:name'] : null;
        console.log('AASSAAAAAA', nameExt, v.tag, v);
        if (v.tag) {
            const childNode = _findChildNode(v.tag, nameExt, node);
            if (childNode) {
                console.log('FOUND EXISTING SHIT TO MERGE', nameExt, v.tag, childNode, v.children);
                _mergeNodeParameters(childNode, v.parameters);
                _mergeNodeChildren(childNode, v.children);
            } else {
                console.log('NO android:name found. adding to children', v);
                node.children.push(v);
            }
        }
    });
};

export const parseAndroidManifestSync = (c, platform) => {
    const pluginConfig = {};
    try {
        const baseManifestFilePath = path.join(c.paths.rnvRootFolder, 'src/platformTools/android/supportFiles/AndroidManifest.json');
        const baseManifestFile = readObjectSync(baseManifestFilePath);
        const appFolder = getAppFolder(c, platform);
        const application = _findChildNode('application', '.MainApplication', baseManifestFile);
        const manifestApplicationParams = application.parameters;

        // projectConfig/plugins.json PLUGIN CONFIG ROOT OVERRIDES
        const pluginConfigAndroid = c.files.pluginConfig?.android || {};
        _mergeNodeParameters(application, pluginConfigAndroid.manifest?.application?.parameters);

        // projectConfig/plugins.json PLUGIN CONFIG OVERRIDES
        parsePlugins(c, (plugin, pluginPlat, key) => {
            if (pluginPlat && pluginPlat.AndroidManifest) {
                const pluginApplication = _findChildNode('application', '.MainApplication', pluginPlat.AndroidManifest);
                console.log('SJHGSJSHGSSG', pluginApplication);
                if (pluginApplication) {
                    _mergeNodeParameters(application, pluginApplication.parameters);

                    _mergeNodeChildren(application, pluginApplication.children);
                }
            }
        });

        // appConfig PERMISSIONS OVERRIDES
        const prms = '';
        const { permissions } = c.files.appConfigFile.platforms[platform];
        const configPermissions = c.files.permissionsConfig?.permissions;

        if (permissions && configPermissions) {
            const platPerm = configPermissions[platform] ? platform : 'android';
            const pc = configPermissions[platPerm];
            if (permissions[0] === '*') {
                for (const k in pc) {
                    // prms += `\n   <uses-permission android:name="${pc[k].key}" />`;
                    baseManifestFile.children.push({
                        tag: 'uses-permission',
                        parameters: {
                            'android:name': pc[k].key
                        }
                    });
                }
            } else {
                permissions.forEach((v) => {
                    if (pc[v]) {
                        // prms += `\n   <uses-permission android:name="${pc[v].key}" />`;
                        baseManifestFile.children.push({
                            tag: 'uses-permission',
                            parameters: {
                                'android:name': pc[v].key
                            }
                        });
                    }
                });
            }
        }


        const manifestXml = _convertToXML(baseManifestFile);
        console.log('SJHGSJHSJSGSJHGSHSGSJHGSJH', manifestXml);
        // get correct source of manifest
        const manifestFile = 'app/src/main/AndroidManifest.xml';

        writeCleanFile(getBuildFilePath(c, platform, manifestFile), path.join(appFolder, manifestFile), [
            { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
            { pattern: '{{PLUGIN_MANIFEST}}', override: prms },
            { pattern: '{{PLUGIN_MANIFEST_APPLICATION}}', override: pluginConfig.manifestApplication },
            { pattern: '{{PLUGIN_MANIFEST_FILE}}', override: manifestXml },
        ]);


        return;
    } catch (e) {
        logError(e);
    }
};
