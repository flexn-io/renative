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
    getBuildFilePath,
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
import { getMergedPlugin, parsePlugins } from '../../pluginTools';

const _findChildNode = (tag, name, node) => {
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

const PROHIBITED_DUPLICATE_TAGS = ['intent-filter'];
const SYSTEM_TAGS = ['tag', 'children'];

const _mergeNodeChildren = (node, nodeChildrenExt) => {
    // console.log('_mergeNodeChildren', node, 'OVERRIDE', nodeChildrenExt);
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
        const baseManifestFilePath = path.join(c.paths.rnvRootFolder, 'src/platformTools/android/supportFiles/AndroidManifest.json');
        const baseManifestFile = readObjectSync(baseManifestFilePath);
        const appFolder = getAppFolder(c, platform);
        const application = _findChildNode('application', '.MainApplication', baseManifestFile);

        baseManifestFile.package = getAppId(c, platform);

        // projectConfig/plugins.json PLUGIN CONFIG ROOT OVERRIDES
        const pluginConfigAndroid = c.files.pluginConfig?.android?.AndroidManifest;
        const applicationExt = _findChildNode('application', '.MainApplication', pluginConfigAndroid);
        _mergeNodeParameters(application, applicationExt);

        // projectConfig/plugins.json PLUGIN CONFIG OVERRIDES
        parsePlugins(c, (plugin, pluginPlat, key) => {
            if (pluginPlat && pluginPlat.AndroidManifest) {
                const pluginApplication = _findChildNode('application', '.MainApplication', pluginPlat.AndroidManifest);
                if (pluginApplication) {
                    _mergeNodeParameters(application, pluginApplication);

                    _mergeNodeChildren(application, pluginApplication.children);
                }
            }
        });

        // appConfig PERMISSIONS OVERRIDES
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
                        'android:name': pc[k].key
                    });
                }
            } else {
                permissions.forEach((v) => {
                    if (pc[v]) {
                        // prms += `\n   <uses-permission android:name="${pc[v].key}" />`;
                        baseManifestFile.children.push({
                            tag: 'uses-permission',
                            'android:name': pc[v].key
                        });
                    }
                });
            }
        }

        const manifestXml = _convertToXML(baseManifestFile);
        // get correct source of manifest
        const manifestFile = 'app/src/main/AndroidManifest.xml';

        writeCleanFile(getBuildFilePath(c, platform, manifestFile), path.join(appFolder, manifestFile), [
            { pattern: '{{PLUGIN_MANIFEST_FILE}}', override: manifestXml },
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
    if (plugin.projectName) {
        c.pluginConfig.pluginIncludes += `, ':${plugin.projectName}'`;
        c.pluginConfig.pluginPaths += `project(':${
            plugin.projectName
        }').projectDir = new File(rootProject.projectDir, '${modulePath}')\n`;
        if (!plugin.skipImplementation) {
            if (plugin.implementation) {
                c.pluginConfig.pluginImplementations += `${plugin.implementation}\n`;
            } else {
                c.pluginConfig.pluginImplementations += `    implementation project(':${plugin.projectName}')\n`;
            }
        }
    } else {
        c.pluginConfig.pluginIncludes += `, ':${key}'`;
        c.pluginConfig.pluginPaths += `project(':${key}').projectDir = new File(rootProject.projectDir, '${modulePath}')\n`;
        if (!plugin.skipImplementation) {
            if (plugin.implementation) {
                c.pluginConfig.pluginImplementations += `${plugin.implementation}\n`;
            } else {
                c.pluginConfig.pluginImplementations += `    implementation project(':${key}')\n`;
            }
        }
    }
    if (plugin.activityImports instanceof Array) {
        plugin.activityImports.forEach((activityImport) => {
            // Avoid duplicate imports
            if (c.pluginConfig.pluginActivityImports.indexOf(activityImport) === -1) {
                c.pluginConfig.pluginActivityImports += `import ${activityImport}\n`;
            }
        });
    }

    if (plugin.activityMethods instanceof Array) {
        c.pluginConfig.pluginActivityMethods += '\n';
        c.pluginConfig.pluginActivityMethods += `${plugin.activityMethods.join('\n    ')}`;
    }

    const mainActivity = plugin.mainActivity;
    if (mainActivity) {
        if (mainActivity.createMethods instanceof Array) {
            c.pluginConfig.pluginActivityCreateMethods += '\n';
            c.pluginConfig.pluginActivityCreateMethods += `${mainActivity.createMethods.join('\n    ')}`;
        }

        if (mainActivity.resultMethods instanceof Array) {
            c.pluginConfig.pluginActivityResultMethods += '\n';
            c.pluginConfig.pluginActivityResultMethods += `${mainActivity.resultMethods.join('\n    ')}`;
        }

        if (mainActivity.imports instanceof Array) {
            mainActivity.imports.forEach((v) => {
                c.pluginConfig.pluginActivityImports += `import ${v}\n`;
            });
        }

        if (mainActivity.methods instanceof Array) {
            c.pluginConfig.pluginActivityMethods += '\n';
            c.pluginConfig.pluginActivityMethods += `${mainActivity.methods.join('\n    ')}`;
        }
    }

    if (pkg) c.pluginConfig.pluginImports += `import ${pkg}\n`;
    if (className) c.pluginConfig.pluginPackages += `${className}(${packageParams}),\n`;

    if (plugin.imports) {
        plugin.imports.forEach((v) => {
            c.pluginConfig.pluginImports += `import ${v}\n`;
        });
    }

    if (plugin.implementations) {
        plugin.implementations.forEach((v) => {
            c.pluginConfig.pluginImplementations += `    implementation ${v}\n`;
        });
    }

    if (plugin.mainApplicationMethods) {
        c.pluginConfig.mainApplicationMethods += `\n${plugin.mainApplicationMethods}\n`;
    }

    const appBuildGradle = plugin['app/build.gradle'];
    if (appBuildGradle) {
        if (appBuildGradle.apply) {
            appBuildGradle.apply.forEach((v) => {
                c.pluginConfig.applyPlugin += `apply ${v}\n`;
            });
        }
    }

    if (plugin.afterEvaluate) {
        plugin.afterEvaluate.forEach((v) => {
            c.pluginConfig.pluginAfterEvaluate += ` ${v}\n`;
        });
    }
    _fixAndroidLegacy(c, pathFixed);
};
