import path from 'path';
import merge from 'deepmerge';

import {
    sanitizeDynamicRefs,
    sanitizeDynamicProps,
    fsExistsSync,
    formatBytes,
    mkdirSync,
    writeFileSync,
} from '../system/fs';
import { chalk, logDefault, logWarning, logDebug } from '../logger';
import { getContext } from '../context/provider';
import type { RnvContext, RnvContextBuildConfig } from '../context/types';
import { FileUtilsPropConfig } from '../system/types';
import { PlatformKey } from '../enums/platformName';

const _arrayMergeOverride = (_destinationArray: Array<string>, sourceArray: Array<string>) => sourceArray;

const getEnginesPluginDelta = () => {
    logDebug('getEnginesPluginDelta');
    const c = getContext();

    if (!c.buildConfig) return;

    const enginePlugins: Record<string, string> = {};
    const missingEnginePlugins: Record<string, string> = {};

    const engineConfig = c.platform ? c.runtime.enginesByPlatform[c.platform]?.config : undefined;
    if (engineConfig?.plugins) {
        const ePlugins = Object.keys(engineConfig.plugins);

        if (ePlugins?.length) {
            ePlugins.forEach((pluginKey) => {
                if (!c.files?.project?.config?.plugins?.[pluginKey] && engineConfig.plugins?.[pluginKey]) {
                    missingEnginePlugins[pluginKey] = engineConfig.plugins?.[pluginKey];
                }
                if (engineConfig.plugins?.[pluginKey]) {
                    enginePlugins[pluginKey] = engineConfig.plugins?.[pluginKey];
                }
            });
        }
    }
    c.runtime.missingEnginePlugins = missingEnginePlugins;
    return enginePlugins;
};

export const generateBuildConfig = () => {
    logDebug('generateBuildConfig');

    const c = getContext();

    const mergeOrder = [
        // TODO: do we need to merge .rnv/renative.json with .customWorkspace/reantive.json ?
        // c.paths.dotRnv.config,
        c.paths.rnvConfigTemplates.config,
        c.paths.workspace.config,
        c.paths.workspace.configPrivate,
        c.paths.workspace.configLocal,
        c.paths.workspace.project.config,
        c.paths.workspace.project.configPrivate,
        c.paths.workspace.project.configLocal,
        ...c.paths.workspace.appConfig.configs,
        ...c.paths.workspace.appConfig.configsPrivate,
        ...c.paths.workspace.appConfig.configsLocal,
        c.paths.project.config,
        c.paths.project.configPrivate,
        c.paths.project.configLocal,
        ...c.paths.appConfig.configs,
        ...c.paths.appConfig.configsPrivate,
        ...c.paths.appConfig.configsLocal,
    ];
    const cleanPaths = mergeOrder.filter((v) => v);
    const existsPaths = cleanPaths.filter((v) => {
        const exists = fsExistsSync(v);
        if (exists) {
            logDebug(`Merged: ${v}`);
        } else {
            // console.log(chalk().red(v));
        }
        return exists;
    });

    const scopedPluginTemplates: Record<string, any> = {};
    if (c.files.scopedConfigTemplates) {
        Object.keys(c.files.scopedConfigTemplates).forEach((v) => {
            const plgs = c.files.scopedConfigTemplates[v].pluginTemplates;
            scopedPluginTemplates[v] = plgs;
        });
    }

    const extraPlugins = getEnginesPluginDelta();

    const mergeFiles = [
        // TODO: do we need to merge .rnv/renative.json with .customWorkspace/reantive.json ?
        // c.files.dotRnv.config,
        c.files.rnvConfigTemplates.config,
        { plugins: extraPlugins },
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

    // mergeFiles.forEach((mergeFile, i) => {
    //     console.log(`MERGEDIAGNOSTICS ${i}`, Object.keys(mergeFile?.plugins || {}));
    // });

    const meta = [
        {
            _meta: {
                generated: new Date().getTime(),
                mergedConfigs: existsPaths,
            },
        },
    ];
    const existsFiles: object[] = [];
    mergeFiles.forEach((v) => {
        if (v !== undefined) {
            existsFiles.push(v);
        }
    });

    logDebug(
        `generateBuildConfig:mergeOrder.length:${mergeOrder.length},cleanPaths.length:${cleanPaths.length},existsPaths.length:${existsPaths.length},existsFiles.length:${existsFiles.length}`
    );

    let out: RnvContextBuildConfig = merge.all<RnvContextBuildConfig>([...meta, ...existsFiles], {
        arrayMerge: _arrayMergeOverride,
    });
    out = merge({}, out);
    // out.pluginTemplates = pluginTemplates;
    out.scopedPluginTemplates = scopedPluginTemplates;

    c.buildConfig = sanitizeDynamicRefs<RnvContextBuildConfig>(c, out);
    const propConfig: FileUtilsPropConfig = {
        files: c.files,
        runtimeProps: c.runtime,
        props: c.buildConfig._refs || {},
        configProps: c.configPropsInjects,
    };
    c.buildConfig = sanitizeDynamicProps(c.buildConfig, propConfig);

    //Merge extendPlatform
    if (c.buildConfig.platforms) {
        const platforms = c.buildConfig.platforms || {};
        (Object.keys(platforms) as PlatformKey[]).forEach((k) => {
            const plat = platforms[k];
            if (plat?.extendPlatform) {
                const extPlat = platforms[plat?.extendPlatform];
                if (extPlat) {
                    platforms[k] = merge(extPlat, plat);
                }
            }
        });
    }

    logDebug('BUILD_CONFIG', Object.keys(c.buildConfig));

    if (c.runtime.appId) {
        c.paths.project.builds.config = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.platform}.json`);

        logDebug(`generateBuildConfig: will sanitize file at: ${c.paths.project.builds.config}`);

        if (c.paths.project.builds.dir) {
            if (!fsExistsSync(c.paths.project.builds.dir)) {
                mkdirSync(c.paths.project.builds.dir);
            }

            const result = writeFileSync(c.paths.project.builds.config, c.buildConfig);
            if (result) {
                const size = formatBytes(Buffer.byteLength(result || '', 'utf8'));
                logDefault(chalk().grey('generateBuildConfig'), `size:${size}`);
            } else {
                logDebug(`generateBuildConfig NOT SAVED: ${c.paths.project.builds.config}`);
            }
        } else {
            logWarning('Cannot save buildConfig as c.paths.project.builds.dir is not defined');
        }
    }

    _checkBuildSchemeIfEngine(c);
};

const _checkBuildSchemeIfEngine = (c: RnvContext) => {
    const { scheme } = c.program.opts();
    if (!c.platform || !scheme) return;

    const platform = c.buildConfig?.platforms?.[c.platform];
    if (!platform) return;

    const definedEngine = platform.buildSchemes?.[scheme]?.engine;
    if (definedEngine) {
        platform.engine = definedEngine;
    }
};
