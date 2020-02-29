import path from 'path';
import {
    getAppFolder,
    getAppTitle,
    writeCleanFile,
    getBuildFilePath,
    getConfigProp,
    sanitizeColor
} from '../../common';
import { writeFileSync } from '../../systemTools/fileutils';

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
