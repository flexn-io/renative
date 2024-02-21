import path from 'path';
import { RenativeConfigPluginPlatform, getAppFolder, getConfigProp, writeFileSync, writeCleanFile } from '@rnv/core';
import { Context } from './types';
import { getBuildFilePath, getAppTitle, sanitizeColor, addSystemInjects } from '@rnv/sdk-utils';

export const parseValuesStringsSync = (c: Context) => {
    const appFolder = getAppFolder(c);
    const stringsPath = 'app/src/main/res/values/strings.xml';
    let strings = '<resources>\n';
    strings += `  <string name="app_name">${getAppTitle(c, c.platform)}</string>\n`;
    c.payload.pluginConfigAndroid.resourceStrings.forEach((v) => {
        strings += `  <${v.tag} name="${v.name}">${v.child_value}</${v.tag}>\n`;
    });
    strings += '</resources>';
    writeFileSync(path.join(appFolder, stringsPath), strings);
};

export const parseValuesColorsSync = (c: Context) => {
    const appFolder = getAppFolder(c);
    const stringsPath = 'app/src/main/res/values/colors.xml';

    const injects = [
        {
            pattern: '{{PLUGIN_COLORS_BG}}',
            override: sanitizeColor(getConfigProp(c, c.platform, 'backgroundColor'), 'backgroundColor').hex,
        },
    ];

    addSystemInjects(c, injects);

    writeCleanFile(
        getBuildFilePath(c, c.platform, stringsPath),
        path.join(appFolder, stringsPath),
        injects,
        undefined,
        c
    );
};

export const injectPluginXmlValuesSync = (c: Context, plugin: RenativeConfigPluginPlatform) => {
    const rStrings = plugin.templateAndroid?.strings_xml?.children;
    if (rStrings) {
        rStrings.forEach((obj) => {
            c.payload.pluginConfigAndroid.resourceStrings.push(obj);
        });
    }
};
