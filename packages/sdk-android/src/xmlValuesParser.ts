import path from 'path';
import {
    RenativeConfigPluginPlatform,
    getAppFolder,
    getConfigProp,
    writeFileSync,
    writeCleanFile,
    getContext,
} from '@rnv/core';
import { getBuildFilePath, getAppTitle, sanitizeColor, addSystemInjects } from '@rnv/sdk-utils';
import { Payload } from './types';

export const parseValuesStringsSync = () => {
    const c = getContext<Payload>();
    const appFolder = getAppFolder();
    const stringsPath = 'app/src/main/res/values/strings.xml';
    let strings = '<resources>\n';
    strings += `  <string name="app_name">${getAppTitle()}</string>\n`;
    c.payload.pluginConfigAndroid.resourceStrings.forEach((v) => {
        strings += `  <${v.tag} name="${v.name}">${v.child_value}</${v.tag}>\n`;
    });
    strings += '</resources>';
    writeFileSync(path.join(appFolder, stringsPath), strings);
};

export const parseValuesColorsSync = () => {
    const c = getContext();
    const appFolder = getAppFolder();
    const stringsPath = 'app/src/main/res/values/colors.xml';

    const injects = [
        {
            pattern: '{{PLUGIN_COLORS_BG}}',
            override: sanitizeColor(getConfigProp('backgroundColor'), 'backgroundColor').hex,
        },
    ];

    addSystemInjects(injects);

    writeCleanFile(getBuildFilePath(stringsPath), path.join(appFolder, stringsPath), injects, undefined, c);
};

export const injectPluginXmlValuesSync = (plugin: RenativeConfigPluginPlatform) => {
    const rStrings = plugin.templateAndroid?.strings_xml?.children;
    if (rStrings) {
        const c = getContext();
        rStrings.forEach((obj) => {
            c.payload.pluginConfigAndroid.resourceStrings.push(obj);
        });
    }
};
