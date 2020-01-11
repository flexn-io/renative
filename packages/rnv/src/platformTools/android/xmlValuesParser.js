import path from 'path';
import os from 'os';
import fs from 'fs';
import net from 'net';
import chalk from 'chalk';
import shell from 'shelljs';
import child_process from 'child_process';
import inquirer from 'inquirer';
import xmlParser from 'xml2json';
import {
    logTask,
    logError,
    getAppFolder,
    isPlatformActive,
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
    logSuccess,
    getBuildsFolder,
    sanitizeColor
} from '../../common';
import { copyBuildsFolder } from '../../projectTools/projectParser';
import { copyFolderContentsRecursiveSync, copyFileSync, mkdirSync, readObjectSync, writeFileSync } from '../../systemTools/fileutils';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';

export const parseValuesStringsSync = (c) => {
    const appFolder = getAppFolder(c, c.platform);
    const stringsPath = 'app/src/main/res/values/strings.xml';
    let strings = '<resources>\n';
    strings += `  <string name="app_name">${getAppTitle(c, c.platform)}</string>\n`;
    c.pluginConfigAndroid.resourceStrings.forEach((v) => {
        strings += `  <${v.tag} name="${v.name}">${v.child_value}</${v.tag}>\n`;
    });
    strings += '</resources>';
    writeFileSync(path.join(appFolder, stringsPath), strings);
};

export const parseValuesColorsSync = (c) => {
    const appFolder = getAppFolder(c, c.platform);
    const stringsPath = 'app/src/main/res/values/colors.xml';
    writeCleanFile(getBuildFilePath(c, c.platform, stringsPath), path.join(appFolder, stringsPath), [
        { pattern: '{{PLUGIN_COLORS_BG}}', override: sanitizeColor(getConfigProp(c, c.platform, 'backgroundColor')).hex },
    ]);
};

export const injectPluginXmlValuesSync = (c, plugin, key, pkg) => {
    const rStrings = plugin.ResourceStrings?.children;
    if (rStrings) {
        rStrings.forEach((obj) => {
            c.pluginConfigAndroid.resourceStrings.push(obj);
        });
    }
};
