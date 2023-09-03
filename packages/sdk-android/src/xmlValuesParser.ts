import path from 'path';
import { FileUtils, Common, RnvContext, RenativeConfigPluginPlatform } from 'rnv';
import { Payload } from './types';

const { getAppFolder, getAppTitle, getBuildFilePath, getConfigProp, sanitizeColor, addSystemInjects } = Common;
const { writeFileSync, writeCleanFile } = FileUtils;

export const parseValuesStringsSync = (c: RnvContext<Payload>) => {
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

export const parseValuesColorsSync = (c: RnvContext<Payload>) => {
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

export const injectPluginXmlValuesSync = (c: RnvContext<Payload>, plugin: RenativeConfigPluginPlatform) => {
    const rStrings = plugin.ResourceStrings?.children;
    if (rStrings) {
        rStrings.forEach((obj) => {
            c.payload.pluginConfigAndroid.resourceStrings.push(obj);
        });
    }
};
