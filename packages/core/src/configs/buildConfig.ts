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
import { chalk, logTask, logWarning, logDebug } from '../logger';
import { getContext } from '../context/provider';
import type { RnvContext } from '../context/types';

const _arrayMergeOverride = (_destinationArray: Array<string>, sourceArray: Array<string>) => sourceArray;

const getEnginesPluginDelta = (c: RnvContext) => {
    logDebug('getEnginesPluginDelta');

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

export const generateBuildConfig = (_c?: RnvContext) => {
    logDebug('generateBuildConfig');

    const c = _c || getContext();

    const mergeOrder = [
        c.paths.defaultWorkspace.config,
        c.paths.rnv.projectTemplates.config,
        c.paths.rnv.pluginTemplates.config,
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

    const pluginTemplates: Record<string, any> = {};
    if (c.files.rnv.pluginTemplates.configs) {
        Object.keys(c.files.rnv.pluginTemplates.configs).forEach((v) => {
            const plgs = c.files.rnv.pluginTemplates.configs[v];
            pluginTemplates[v] = plgs;
        });
    }

    const extraPlugins = getEnginesPluginDelta(c);

    const mergeFiles = [
        c.files.defaultWorkspace.config,
        c.files.rnv.projectTemplates.config,
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

    let out: any = merge.all([...meta, ...existsFiles], {
        arrayMerge: _arrayMergeOverride,
    });
    out = merge({}, out);
    out.pluginTemplates = pluginTemplates;

    c.buildConfig = sanitizeDynamicRefs(c, out);
    const propConfig = {
        files: c.files,
        runtimeProps: c.runtime,
        props: c.buildConfig._refs,
        configProps: c.configPropsInjects,
    };
    c.buildConfig = sanitizeDynamicProps(c.buildConfig, propConfig);

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
                logTask(chalk().grey('generateBuildConfig'), `size:${size}`);
            } else {
                logDebug(`generateBuildConfig NOT SAVED: ${c.paths.project.builds.config}`);
            }
        } else {
            logWarning('Cannot save buildConfig as c.paths.project.builds.dir is not defined');
        }
    }
};
