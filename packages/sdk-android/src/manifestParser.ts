import path from 'path';
import {
    getAppFolder,
    getConfigProp,
    getFlavouredProp,
    logDefault,
    logError,
    logWarning,
    logDebug,
    readObjectSync,
    writeCleanFile,
    parsePlugins,
    AndroidManifestNode,
    AndroidManifest,
    ConfigPropKey,
    RnvContext,
    RnvPlatform,
    ConfigProp,
    _getConfigProp,
    ConfigFileBuildConfig,
} from '@rnv/core';
import { Context } from './types';
import { getBuildFilePath, getAppId, addSystemInjects } from '@rnv/sdk-utils';

const PROHIBITED_DUPLICATE_TAGS = ['intent-filter'];
const SYSTEM_TAGS = ['tag', 'children'];

const _findChildNode = (tag: string, name: string, node: AndroidManifestNode) => {
    if (!node) {
        logWarning('_findChildNode: Node is undefined');
        return;
    }
    if (!name && !PROHIBITED_DUPLICATE_TAGS.includes(tag)) return null; // Can't determine reused child nodes without unique name identifier
    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            const ch = node.children?.[i];
            if (ch && ch.tag === tag) {
                if (ch['android:name'] === name || PROHIBITED_DUPLICATE_TAGS.includes(tag)) {
                    return ch;
                }
            }
        }
    }

    return null;
};

const _convertToXML = (manifestObj: AndroidManifestNode) => _parseNode(manifestObj, 0);

type NodeKey = keyof AndroidManifestNode;

const _parseNode = (n: AndroidManifestNode, level: number) => {
    let output = '';
    let space = '';
    for (let i = 0; i < level; i++) {
        space += '    ';
    }

    let nodeKeysCount = 0;
    Object.keys(n).forEach((v) => {
        if (!SYSTEM_TAGS.includes(v)) nodeKeysCount++;
    });
    const isSingleLine = nodeKeysCount < 2;

    if (!n.tag) {
        logWarning('Each node must have tag key!');
        return;
    }

    if (n) {
        const endLine = isSingleLine ? ' ' : '\n';
        output += `${space}<${n.tag}${endLine}`;
        Object.keys(n).forEach((k) => {
            if (!SYSTEM_TAGS.includes(k)) {
                output += `${isSingleLine ? '' : `${space}  `}${k}="${n[k as NodeKey]}"${endLine}`;
            }
        });
    }
    // else {
    //     output += `${space}<${n.tag}`;
    // }
    if (n.children && n.children.length) {
        if (isSingleLine) {
            output += '>\n';
        } else {
            output += `${space}>\n`;
        }

        const nextLevel = level + 1;
        n.children.forEach((v) => {
            output += _parseNode(v, nextLevel);
        });
        output += `${space}</${n.tag}>\n`;
    } else {
        output += `${isSingleLine ? '' : space}/>\n`;
    }
    return output;
};

const _mergeNodeParameters = (
    node: AndroidManifestNode | undefined,
    nodeParamsExt: AndroidManifestNode | undefined
) => {
    if (!nodeParamsExt) {
        logWarning('_mergeNodeParameters: nodeParamsExt value is null');
        return;
    }
    if (!node) {
        logWarning('_mergeNodeParameters: node value is null');
        return;
    }

    Object.keys(nodeParamsExt).forEach((k) => {
        const key = k as NodeKey;
        const val = nodeParamsExt[key];

        if (val !== 'undefined' && !SYSTEM_TAGS.includes(k)) {
            //TODO: fix this
            (node as Record<string, any>)[key] = val;
        }
    });
};

const _mergeNodeChildren = (node: AndroidManifestNode, nodeChildrenExt: Array<AndroidManifestNode> = []) => {
    // console.log('_mergeNodeChildren', node, 'OVERRIDE', nodeChildrenExt);
    if (!node) {
        logWarning('_mergeNodeChildren: Node is undefined');
        return;
    }
    if (!node.children) node.children = [];
    nodeChildrenExt.forEach((v) => {
        const nameExt = v['android:name'];
        if (v.tag) {
            const childNode = _findChildNode(v.tag, nameExt, node);
            if (childNode) {
                logDebug(`_mergeNodeChildren: FOUND EXISTING NODE TO MERGE ${nameExt} ${v.tag}`);
                _mergeNodeParameters(childNode, v);
                _mergeNodeChildren(childNode, v.children);
            } else {
                logDebug(`_mergeNodeChildren: NO android:name found. adding to children ${nameExt} ${v.tag}`);
                if (node.children) node.children.push(v);
            }
        }
    });
};

// type ManifestFeature = {
//     tag: string;
//     'android:name': string;
//     'android:required': boolean;
//     children?: Array<ManifestFeature>;
// };

// type ManufestNode = {
//     children:
// }

const _mergeFeatures = (
    c: Context,
    baseManifestFile: AndroidManifest,
    configKey: 'includedFeatures' | 'excludedFeatures',
    value: boolean
) => {
    const features = getConfigProp(configKey);

    if (features) {
        const featuresObj: Array<AndroidManifestNode> = [];
        features.forEach((key) => {
            featuresObj.push({
                tag: 'uses-feature',
                'android:name': key,
                'android:required': value,
            });
        });
        _mergeNodeChildren(baseManifestFile, featuresObj);
    }
};

const getConfigPropArray = <T extends ConfigPropKey>(c: RnvContext, platform: RnvPlatform, key: T) => {
    const result: Array<ConfigProp[T]> = [];
    const configArr = [
        c.files.defaultWorkspace.config,
        c.files.rnv.projectTemplates.config,
        // { plugins: extraPlugins },
        // { pluginTemplates },
        c.files.workspace.config,
        c.files.workspace.configPrivate,
        c.files.workspace.configLocal,
        c.files.workspace.project.config,
        c.files.workspace.project.configPrivate,
        c.files.workspace.project.configLocal,
        ...c.files.workspace.appConfig.configs,
        ...c.files.workspace.appConfig.configsPrivate,
        ...c.files.workspace.appConfig.configsLocal,
        c.files.project.config,
        c.files.project.configPrivate,
        c.files.project.configLocal,
        ...c.files.appConfig.configs,
        ...c.files.appConfig.configsPrivate,
        ...c.files.appConfig.configsLocal,
    ];
    configArr.forEach((config) => {
        if (config) {
            //TODO: this is bit of a hack. _getConfigProp expectes already merged obj needs to be redone
            const val = _getConfigProp(key, null, config as ConfigFileBuildConfig);
            if (val) {
                result.push(val);
            }
        }
    });

    return result;
};

export const parseAndroidManifestSync = (c: Context) => {
    logDefault('parseAndroidManifestSync');
    const { platform } = c;

    if (!platform) return;

    try {
        const baseManifestFilePath = path.join(__dirname, `../supportFiles/AndroidManifest_${platform}.json`);
        const baseManifestFile = readObjectSync<AndroidManifest>(baseManifestFilePath);

        if (!baseManifestFile) {
            return;
        }

        baseManifestFile.package = getAppId();

        const objArr = getConfigPropArray(c, c.platform, 'templateAndroid');

        // PARSE all standard renative.*.json files in correct mergeOrder
        objArr.forEach((tpl) => {
            const manifestObj = tpl?.AndroidManifest_xml;
            if (manifestObj) {
                _mergeNodeParameters(baseManifestFile, manifestObj);
            }
            if (manifestObj?.children) {
                _mergeNodeChildren(baseManifestFile, manifestObj.children);
            }
        });

        // appConfigs/base/plugins.json PLUGIN CONFIG OVERRIDES
        parsePlugins(c, platform, (_plugin, pluginPlat) => {
            const androidManifestPlugin = getFlavouredProp(c, pluginPlat, 'templateAndroid')?.AndroidManifest_xml;
            if (androidManifestPlugin) {
                _mergeNodeChildren(baseManifestFile, androidManifestPlugin.children);
                if (androidManifestPlugin.children) {
                    _mergeNodeChildren(baseManifestFile, androidManifestPlugin.children);
                }
            }
        });

        // appConfig PERMISSIONS OVERRIDES
        const configPermissions = c.buildConfig?.permissions;

        const includedPermissions = getConfigProp('includedPermissions');
        const excludedPermissions = getConfigProp('excludedPermissions');
        if (includedPermissions?.forEach && configPermissions) {
            const platPerm = 'android'; //configPermissions[platform] ? platform : 'android';
            const pc = configPermissions[platPerm];
            if (pc) {
                if (includedPermissions[0] === '*') {
                    Object.keys(pc).forEach((k) => {
                        if (!(excludedPermissions && excludedPermissions.includes(k))) {
                            const key = pc[k].key || k;
                            baseManifestFile.children = baseManifestFile.children || [];
                            baseManifestFile.children.push({
                                tag: 'uses-permission',
                                'android:name': key,
                            });
                        }
                    });
                } else {
                    includedPermissions.forEach((v) => {
                        if (pc[v]) {
                            const key = pc[v].key || v;
                            baseManifestFile.children = baseManifestFile.children || [];
                            baseManifestFile.children.push({
                                tag: 'uses-permission',
                                'android:name': key,
                            });
                        }
                    });
                }
            }
        } else if (includedPermissions) {
            logWarning('includedPermissions not parsed. make sure it an array format!');
        }

        // appConfig FEATURES OVERRIDES
        _mergeFeatures(c, baseManifestFile, 'includedFeatures', true);
        _mergeFeatures(c, baseManifestFile, 'excludedFeatures', false);

        const manifestXml = _convertToXML(baseManifestFile);
        // get correct source of manifest
        const manifestFile = 'app/src/main/AndroidManifest.xml';

        const injects = [{ pattern: '{{PLUGIN_MANIFEST_FILE}}', override: manifestXml || '' }];
        addSystemInjects(c, injects);

        const appFolder = getAppFolder();

        writeCleanFile(
            getBuildFilePath(c, platform, manifestFile),
            path.join(appFolder, manifestFile),
            injects,
            undefined,
            c
        );

        return;
    } catch (e) {
        logError(e);
    }
};

export const injectPluginManifestSync = () => {
    // const className = pkg ? pkg.split('.').pop() : null;
    // let packageParams = '';
    // if (plugin.packageParams) {
    //     packageParams = plugin.packageParams.join(',');
    // }
    //
    // const pathFixed = plugin.path
    //     ? `${plugin.path}`
    //     : `node_modules/${key}/android`;
    // const modulePath = `../../${pathFixed}`;
};
