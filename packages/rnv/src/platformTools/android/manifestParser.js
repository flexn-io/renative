import path from 'path';
import {
    getAppFolder,
    writeCleanFile,
    getAppId,
    getBuildFilePath,
    getConfigProp,
    getFlavouredProp
} from '../../common';
import {
    logTask,
    logError,
    logWarning
} from '../../systemTools/logger';
import { readObjectSync } from '../../systemTools/fileutils';
import { getMergedPlugin, parsePlugins } from '../../pluginTools';

const PROHIBITED_DUPLICATE_TAGS = ['intent-filter'];
const SYSTEM_TAGS = ['tag', 'children'];

const _findChildNode = (tag, name, node) => {
    if (!node) {
        logWarning('_findChildNode: Node is undefined');
        return;
    }
    if (!name && !PROHIBITED_DUPLICATE_TAGS.includes(tag)) return null; // Can't determine reused child nodes without unique name identifier
    for (let i = 0; i < node.children.length; i++) {
        const ch = node.children[i];
        if (ch.tag === tag) {
            if ((ch['android:name'] === name) || PROHIBITED_DUPLICATE_TAGS.includes(tag)) return ch;
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
        for (const k in n) {
            if (!SYSTEM_TAGS.includes(k)) {
                output += `${isSingleLine ? '' : `${space}  `}${k}="${n[k]}"${endLine}`;
            }
        }
    } else {
        output += `${space}<${n.tag}`;
    }
    if (n.children && n.children.length) {
        if (isSingleLine) {
            output += '>\n';
        } else {
            output += `${space}>\n`;
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
    if (!nodeParamsExt) {
        logWarning('_mergeNodeParameters: nodeParamsExt value is null');
        return;
    }
    if (!node) {
        logWarning('_mergeNodeParameters: node value is null');
        return;
    }

    for (const k in nodeParamsExt) {
        if (!SYSTEM_TAGS.includes(k)) node[k] = nodeParamsExt[k];
    }
};

const _mergeNodeChildren = (node, nodeChildrenExt = []) => {
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
                console.log('_mergeNodeChildren: FOUND EXISTING NODE TO MERGE', nameExt, v.tag);
                _mergeNodeParameters(childNode, v);
                _mergeNodeChildren(childNode, v.children);
            } else {
                console.log('_mergeNodeChildren: NO android:name found. adding to children', nameExt, v.tag);
                node.children.push(v);
            }
        }
    });
};

export const parseAndroidManifestSync = (c, platform) => {
    logTask(`parseAndroidManifestSync:${platform}`);
    const pluginConfig = {};
    try {
        const baseManifestFilePath = path.join(c.paths.rnv.dir, `src/platformTools/android/supportFiles/AndroidManifest_${platform}.json`);
        const baseManifestFile = readObjectSync(baseManifestFilePath);
        const appFolder = getAppFolder(c, platform);
        const application = _findChildNode('application', '.MainApplication', baseManifestFile);

        baseManifestFile.package = getAppId(c, platform);

        // appConfigs/base/plugins.json PLUGIN CONFIG ROOT OVERRIDES
        const pluginConfigAndroid = getFlavouredProp(c, c.buildConfig?.platforms?.[platform], 'AndroidManifest');

        if (pluginConfigAndroid) {
            const applicationExt = _findChildNode('application', '.MainApplication', pluginConfigAndroid);
            _mergeNodeParameters(application, applicationExt);
            if (applicationExt.children) {
                _mergeNodeChildren(application, applicationExt.children);
            }
        }

        // appConfigs/base/plugins.json PLUGIN CONFIG OVERRIDES
        parsePlugins(c, platform, (plugin, pluginPlat, key) => {
            const androidManifest = getFlavouredProp(c, pluginPlat, 'AndroidManifest');
            if (androidManifest) {
                _mergeNodeChildren(baseManifestFile, androidManifest.children);
                // const pluginApplication = _findChildNode('application', '.MainApplication', pluginPlat.AndroidManifest);
                // if (pluginApplication) {
                //     _mergeNodeParameters(application, pluginApplication);
                //
                //     _mergeNodeChildren(application, pluginApplication.children);
                // }
            }
        });

        // appConfig PERMISSIONS OVERRIDES
        let prms = '';
        const configPermissions = c.buildConfig?.permissions;

        const includedPermissions = getConfigProp(c, platform, 'includedPermissions') || getConfigProp(c, platform, 'permissions');
        const excludedPermissions = getConfigProp(c, platform, 'excludedPermissions');
        if (includedPermissions && configPermissions) {
            const platPerm = configPermissions[platform] ? platform : 'android';
            const pc = configPermissions[platPerm];
            if (includedPermissions[0] === '*') {
                for (const k in pc) {
                    if (!(excludedPermissions && excludedPermissions.includes(k))) {
                        prms += `\n   <uses-permission android:name="${pc[k].key}" />`;
                        const key = pc[k].key || k;
                        baseManifestFile.children.push({
                            tag: 'uses-permission',
                            'android:name': key
                        });
                    }
                }
            } else {
                includedPermissions.forEach((v) => {
                    if (pc[v]) {
                        prms += `\n   <uses-permission android:name="${pc[v].key}" />`;
                        const key = pc[v].key || k;
                        baseManifestFile.children.push({
                            tag: 'uses-permission',
                            'android:name': key
                        });
                    }
                });
            }
        }

        // appConfig FEATURES OVERRIDES
        const includedFeatures = getConfigProp(c, platform, 'includedFeatures');
        if (includedFeatures) {
            includedFeatures.forEach((key) => {
                baseManifestFile.children.push({
                    tag: 'uses-feature',
                    'android:name': key,
                    'android:required': true
                });
            });
        }

        const excludedFeatures = getConfigProp(c, platform, 'excludedFeatures');
        if (excludedFeatures) {
            excludedFeatures.forEach((key) => {
                baseManifestFile.children.push({
                    tag: 'uses-feature',
                    'android:name': key,
                    'android:required': false
                });
            });
        }

        const manifestXml = _convertToXML(baseManifestFile);
        // get correct source of manifest
        const manifestFile = 'app/src/main/AndroidManifest.xml';

        writeCleanFile(getBuildFilePath(c, platform, manifestFile), path.join(appFolder, manifestFile), [
            { pattern: '{{PLUGIN_MANIFEST_FILE}}', override: manifestXml },
            { pattern: '{{PERMISIONS}}', override: prms },
            { pattern: '{{APPLICATION_ID}}', override: baseManifestFile.package }
        ]);

        return;
    } catch (e) {
        logError(e);
    }
};

export const injectPluginManifestSync = (c, plugin, key, pkg) => {
    const className = pkg ? pkg.split('.').pop() : null;
    let packageParams = '';
    if (plugin.packageParams) {
        packageParams = plugin.packageParams.join(',');
    }

    const pathFixed = plugin.path ? `${plugin.path}` : `node_modules/${key}/android`;
    const modulePath = `../../${pathFixed}`;
};
