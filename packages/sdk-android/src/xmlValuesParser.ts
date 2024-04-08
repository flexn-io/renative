import path from 'path';
import {
    getAppFolder,
    getConfigProp,
    writeCleanFile,
    ConfigAndroidResources,
    getContext,
    logDefault,
    readObjectSync,
    logError,
    parsePlugins,
    getFlavouredProp,
    RnvFolderName,
} from '@rnv/core';
import { getBuildFilePath, getAppTitle, sanitizeColor, addSystemInjects } from '@rnv/sdk-utils';
import { _convertToXML, _mergeNodeChildren, _mergeNodeParameters, getConfigPropArray } from './manifestParser';
import { TargetResourceFile } from './types';

export const parseValuesXml = (targetRes: TargetResourceFile, injectValue?: boolean) => {
    const c = getContext();
    logDefault(`parseValuesXml: ${targetRes}`);
    const { platform } = c;
    const appFolder = getAppFolder();
    if (!platform) return;

    try {
        const baseResoutcesFilePath = path.join(
            __dirname,
            RnvFolderName.UP,
            RnvFolderName.templateFiles,
            `${targetRes}.json`
        );
        const baseResourcesFile = readObjectSync<ConfigAndroidResources>(baseResoutcesFilePath);
        const resourceFile = `app/src/main/res/values/${targetRes.replace('_', '.')}`;

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

        const injects = [{ pattern: _getPattern(targetRes), override: resourceXml || '' }];

        addSystemInjects(injects);
        const buildFilePath = getBuildFilePath(resourceFile);
        const projectFilePath = path.join(appFolder, resourceFile);

        if (!injectValue) {
            writeCleanFile(buildFilePath, projectFilePath, injects, undefined, c);
        } else {
            writeCleanFile(buildFilePath, projectFilePath, injects, undefined, c);
            _overrideDynamicValue(projectFilePath);
        }

        return;
    } catch (e) {
        logError(e);
    }
};

const _getPattern = (targetRes: TargetResourceFile): string => {
    return `{{PLUGIN_${targetRes.toUpperCase()}_FILE}}`;
};
const _overrideDynamicValue = (stringsPath: string) => {
    const c = getContext();

    const injects = [
        {
            pattern: '{{PLUGIN_COLORS_BG}}',
            override: sanitizeColor(getConfigProp('backgroundColor'), 'backgroundColor').hex || '#FFFFFF',
        },
        { pattern: '{{APP_TITLE}}', override: getAppTitle() || '' },
    ];

    addSystemInjects(injects);

    writeCleanFile(stringsPath, stringsPath, injects, undefined, c);
};
