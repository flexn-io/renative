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

const _findChildNode = (tag, name, manifestObj) => {
    for (let i = 0; i < manifestObj.children.length; i++) {
        const ch = manifestObj.children[i];
        if (ch.tag === tag && ch.parameters && ch.parameters['android:name'] === name) return ch;
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

    if (n.parameters) {
        output += `${space}<${n.tag}\n`;
        for (const k in n.parameters) {
            output += `${space}  ${k}="${n.parameters[k]}"\n`;
        }
    } else {
        output += `${space}<${n.tag}`;
    }
    if (n.children && n.children.length) {
        if (n.parameters) {
            output += `${space}>\n`;
        } else {
            output += '>\n';
        }

        const nextLevel = level += 1;
        n.children.forEach((v) => {
            output += _parseNode(v, nextLevel);
        });
        output += `${space}</${n.tag}>\n`;
    } else {
        output += `${space} />\n`;
    }
    return output;
};

export const parseAndroidManifest = (c, platform) => new Promise((resolve, reject) => {
    const pluginConfig = {};
    // ANDROID MANIFET
    console.log('DHKJDDJKD', c.paths.rnvRootFolder);
    try {
        const baseManifestFilePath = path.join(c.paths.rnvRootFolder, 'src/platformTools/android/supportFiles/AndroidManifest.json');
        const baseManifestFile = readObjectSync(baseManifestFilePath);

        const pluginConfigAndroid = c.files.pluginConfig?.android || {};


        const application = _findChildNode('application', '.MainApplication', baseManifestFile);
        console.log('DHKJDDJKD2', application);
        const manifestApplicationParams = application.parameters;
        const manifestApplicationParamsExt = pluginConfigAndroid.manifest?.application?.parameters;
        if (manifestApplicationParamsExt) {
            application.parameters = { ...manifestApplicationParams, ...manifestApplicationParamsExt };
        }


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

        writeCleanFile(_getBuildFilePath(c, platform, manifestFile), path.join(appFolder, manifestFile), [
            { pattern: '{{APPLICATION_ID}}', override: getAppId(c, platform) },
            { pattern: '{{PLUGIN_MANIFEST}}', override: prms },
            { pattern: '{{PLUGIN_MANIFEST_APPLICATION}}', override: pluginConfig.manifestApplication },
        ]);

        resolve();
        return;
    } catch (e) {
        logError(e);
        reject(e);
    }
});
