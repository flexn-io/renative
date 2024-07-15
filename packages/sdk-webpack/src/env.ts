import {
    doResolvePath,
    getConfigProp,
    getContext,
    includesPluginPath,
    parsePlugins,
    sanitizePluginPath,
} from '@rnv/core';
import path from 'path';

export type RnvModuleConfig = {
    modulePaths: Array<string>;
    moduleAliases: Record<string, string | undefined>;
    moduleAliasesArray: Array<string>;
};

export const EnvVars = {
    RNV_MODULE_CONFIGS: () => {
        const configs = getModuleConfigs();

        return {
            RNV_MODULE_PATHS: configs.modulePaths,
            RNV_MODULE_ALIASES: configs.moduleAliasesArray,
        };
    },
    PUBLIC_URL: () => {
        return { PUBLIC_URL: getConfigProp('webpackConfig')?.publicUrl || '.' };
    },
    RNV_ENTRY_FILE: () => {
        return { RNV_ENTRY_FILE: getConfigProp('entryFile') };
    },
    PORT: () => {
        const ctx = getContext();
        return { PORT: ctx.runtime.port };
    },
    WEBPACK_TARGET: () => {
        const ctx = getContext();
        if (ctx.runtime.webpackTarget) {
            return { WEBPACK_TARGET: ctx.runtime.webpackTarget };
        }
    },
    WEBPACK_EXCLUDED_PATHS: () => {
        const webpackConfig = getConfigProp('webpackConfig');

        if (webpackConfig?.excludedPaths) {
            return { WEBPACK_EXCLUDED_PATHS: webpackConfig?.excludedPaths };
        }
    },
    RNV_EXTERNAL_PATHS: () => {
        const ctx = getContext();
        return { RNV_EXTERNAL_PATHS: [ctx.paths.project.assets.dir, ctx.paths.project.dir].join(',') };
    },
};

export const getModuleConfigs = (): RnvModuleConfig => {
    const c = getContext();

    let modulePaths: Array<string> = [];
    const moduleAliases: Record<string, string | undefined> = {};

    const doNotResolveModulePaths: Array<string> = [];

    // PLUGINS
    parsePlugins((plugin, pluginPlat, key) => {
        const { webpackConfig } = plugin;

        if (webpackConfig) {
            if (webpackConfig.modulePaths) {
                if (typeof webpackConfig.modulePaths === 'boolean') {
                    if (webpackConfig.modulePaths) {
                        modulePaths.push(`node_modules/${key}`);
                    }
                } else {
                    webpackConfig.modulePaths.forEach((v) => {
                        modulePaths.push(v);
                    });
                }
            }
            const wpMa = webpackConfig.moduleAliases;
            if (wpMa) {
                if (typeof wpMa === 'boolean') {
                    moduleAliases[key] = doResolvePath(key, true, {}, c.paths.project.nodeModulesDir);
                } else {
                    Object.keys(wpMa).forEach((aKey) => {
                        const mAlias = wpMa[aKey];
                        if (typeof mAlias === 'string') {
                            moduleAliases[key] = doResolvePath(mAlias, true, {}, c.paths.project.nodeModulesDir);
                            // DEPRECATED use => projectPath
                            // } else if (mAlias.path) {
                            //     moduleAliases[key] = path.join(c.paths.project.dir, mAlias.path);
                        } else if (includesPluginPath(mAlias.projectPath)) {
                            moduleAliases[key] = sanitizePluginPath(mAlias.projectPath, key);
                        } else if (mAlias.projectPath) {
                            moduleAliases[key] = path.join(c.paths.project.dir, mAlias.projectPath);
                        }
                    });
                }
            }
        }
    }, true);

    const moduleAliasesArray: Array<string> = [];
    Object.keys(moduleAliases).forEach((key) => {
        moduleAliasesArray.push(`${key}:${moduleAliases[key]}`);
    });

    modulePaths = modulePaths
        .map((v) => v && doResolvePath(v, true, {}, c.paths.project.dir)!)
        .concat(doNotResolveModulePaths)
        .concat([c.paths.project.assets.dir])
        .filter(Boolean);

    return { modulePaths, moduleAliases, moduleAliasesArray };
};
