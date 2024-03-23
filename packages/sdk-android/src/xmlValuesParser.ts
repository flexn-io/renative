import path from 'path';
import {
    RenativeConfigPluginPlatform,
    getAppFolder,
    getConfigProp,
    writeFileSync,
    writeCleanFile,
    getContext,
    OverridesOptions,
    logDefault,
    readObjectSync,
    AndroidResources,
    logError,
    parsePlugins,
    getFlavouredProp,
} from '@rnv/core';
import { getBuildFilePath, getAppTitle, sanitizeColor, addSystemInjects } from '@rnv/sdk-utils';
import { Payload, ResourceStyles, TemplateAndroid } from './types';
import { _convertToXML, _mergeNodeChildren, _mergeNodeParameters, getConfigPropArray } from './manifestParser';

export const parseValuesStringsSync = () => {
    const c = getContext<Payload>();
    const appFolder = getAppFolder();
    const templateAndroid = getConfigProp('templateAndroid', {});

    const resourceStrings = templateAndroid?.strings_xml?.children;
    if (resourceStrings) {
        resourceStrings.forEach((obj) => {
            c.payload.pluginConfigAndroid.resourceStrings.push(obj);
        });
    }
    const stringsPath = 'app/src/main/res/values/strings.xml';
    let strings = '<resources>\n';
    strings += `  <string name="app_name">${getAppTitle()}</string>\n`;
    c.payload.pluginConfigAndroid.resourceStrings.forEach((v) => {
        strings += `  <${v.tag} name="${v.name}">${v.child_value}</${v.tag}>\n`;
    });
    strings += '</resources>';
    writeFileSync(path.join(appFolder, stringsPath), strings);
};
export const parseValuesStylesSync = () => {
    const c = getContext<Payload>();
    const appFolder = getAppFolder();
    const templateAndroid = getConfigProp('templateAndroid', {});

    const resourceStylesValues = templateAndroid?.styles_xml;

    if (resourceStylesValues) {
        Object.entries(resourceStylesValues).forEach(([key, values]) => {
            const xmlStringObject: Partial<ResourceStyles> = {};
            Object.entries(values).forEach(([childKey, children]) => {
                let string = '';
                children.forEach((child) => {
                    string += `<${child.tag} name="${child.name}">${child.child_value}</${child.tag}>\n`;
                });
                xmlStringObject[childKey as keyof ResourceStyles] = string;
            });

            if (key === 'values') {
                c.payload.pluginConfigAndroid.resourceStylesValue = xmlStringObject as ResourceStyles;
            } else if (key === 'values_v28') {
                c.payload.pluginConfigAndroid.resourceStylesValueV28 = xmlStringObject as ResourceStyles;
            }
        });
    }

    const injects: OverridesOptions = [
        {
            pattern: '{{VALUES_STYLES_APP}}',
            override: c.payload.pluginConfigAndroid.resourceStylesValue.app_children || '',
        },
        {
            pattern: '{{VALUES_STYLES_SPLASH}}',
            override: c.payload.pluginConfigAndroid.resourceStylesValue.splash_children || '',
        },

        {
            pattern: '{{VALUES_V28_STYLES_APP}}',
            override: c.payload.pluginConfigAndroid.resourceStylesValueV28.app_children || '',
        },

        {
            pattern: '{{VALUES_V28_STYLES_SPLASH}}',
            override: c.payload.pluginConfigAndroid.resourceStylesValueV28.splash_children || '',
        },
    ];

    addSystemInjects(injects);
    const stylePath1 = 'app/src/main/res/values/styles.xml';
    const stylePath2 = 'app/src/main/res/values-v28/styles.xml';
    writeCleanFile(getBuildFilePath(stylePath1), path.join(appFolder, stylePath1), injects, undefined, c);
    writeCleanFile(getBuildFilePath(stylePath2), path.join(appFolder, stylePath2), injects, undefined, c);
};
export const parseValuesXml = (targetRes: 'styles_xml' | 'strings_xml' | 'colors_xml') => {
    const c = getContext();
    logDefault('parseValuesStylesSync');
    const { platform } = c;

    if (!platform) return;

    try {
        const baseResoutcesFilePath = path.join(__dirname, `../supportFiles/${targetRes}.json`);
        const baseResourcesFile = readObjectSync<AndroidResources>(baseResoutcesFilePath);

        if (!baseResourcesFile) {
            return;
        }
        const objArr = getConfigPropArray(c, c.platform, 'templateAndroid');

        // PARSE all standard renative.*.json files in correct mergeOrder
        objArr.forEach((tpl) => {
            const resourceObj = tpl?.[targetRes];
            if (resourceObj) {
                _mergeNodeParameters(baseResourcesFile, resourceObj);
            }
            if (resourceObj?.children) {
                _mergeNodeChildren(baseResourcesFile, resourceObj.children);
            }
        });

        // appConfigs/base/plugins.json PLUGIN CONFIG OVERRIDES
        parsePlugins((_plugin, pluginPlat) => {
            const resourcesPlugin = getFlavouredProp(pluginPlat, 'templateAndroid')?.[targetRes];
            if (resourcesPlugin) {
                _mergeNodeChildren(baseResourcesFile, resourcesPlugin.children);
                if (resourcesPlugin.children) {
                    _mergeNodeChildren(baseResourcesFile, resourcesPlugin.children);
                }
            }
        });

        const resourceXml = _convertToXML(baseResourcesFile);
        const resourceFile = `app/src/main/res/values/${targetRes.replace('_', '.')}`;
        const getPattern = (): string => {
            return `{{PLUGIN_${targetRes.toUpperCase()}_FILE}}`;
        };
        const injects = [{ pattern: getPattern(), override: resourceXml || '' }];

        addSystemInjects(injects);

        const appFolder = getAppFolder();
        writeCleanFile(getBuildFilePath(resourceFile), path.join(appFolder, resourceFile), injects, undefined, c);

        return;
    } catch (e) {
        logError(e);
    }
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
