import path from 'path';
import { getAppConfigBuildsFolder, getAppFolder, getConfigRootProp } from '../context/contextProps';
import { parseRenativeConfigs } from '../configs';
import {
    copyFolderContentsRecursiveSync,
    fsCopyFileSync,
    fsExistsSync,
    fsLstatSync,
    fsMkdirSync,
    fsReadFileSync,
    fsWriteFileSync,
    mergeObjects,
    readObjectSync,
    sanitizeDynamicProps,
} from '../system/fs';
import { chalk, logDebug, logError, logInfo, logSuccess, logDefault, logWarning } from '../logger';
import { doResolve } from '../system/resolve';
import type { RnvContext } from '../context/types';
import type { PluginCallback, RnvPlugin, RnvPluginScope } from './types';
import { inquirerPrompt } from '../api';
import { writeRenativeConfigFile } from '../configs/utils';
import { installPackageDependencies } from '../projects/npm';
import type { OverridesOptions, ResolveOptions } from '../system/types';
import { getContext } from '../context/provider';
import { getConfigProp } from '../context/contextProps';
import { RnvFileName } from '../enums/fileName';
import type { AsyncCallback } from '../projects/types';
import { createDependencyMutation } from '../projects/mutations';
import { updatePackage } from '../projects/package';
import type {
    ConfigFileOverrides,
    ConfigFilePlugin,
    ConfigFileTemplates,
    ConfigProjectPaths,
    ConfigPluginPlatformSchema,
    ConfigPluginSchema,
} from '../schema/types';
import fs from 'fs';
const _getPluginScope = (plugin: ConfigPluginSchema | string): RnvPluginScope => {
    if (typeof plugin === 'string') {
        if (plugin.startsWith('source:')) {
            return { scope: plugin.split(':').pop() || 'rnv' };
        }
        return { npmVersion: plugin, scope: 'rnv' };
    }
    if (plugin?.source) {
        return { scope: plugin?.source };
    }
    return { scope: 'rnv' };
};

export const getMergedPlugin = (c: RnvContext, key: string) => {
    logDebug(`getMergedPlugin:${key}`);

    const plugin = c.buildConfig.plugins?.[key];
    if (!plugin) return null;

    const scopes: Array<string> = [];

    const mergedPlugin = _getMergedPlugin(c, plugin, key, undefined, scopes);
    scopes.reverse();

    mergedPlugin._scopes = scopes;
    mergedPlugin._id = key;
    return mergedPlugin;
};

const _getMergedPlugin = (
    c: RnvContext,
    plugin: ConfigPluginSchema | string | undefined,
    pluginKey: string,
    parentScope?: string,
    scopes?: Array<string>,
    skipSanitize?: boolean
): RnvPlugin => {
    if (!plugin) {
        return {};
    }

    const { scope, npmVersion } = _getPluginScope(plugin);

    const mergedPlgn: RnvPlugin = typeof plugin !== 'string' ? plugin : {};
    if (scope === parentScope) {
        return mergedPlgn;
    }

    if (npmVersion) {
        return {
            version: npmVersion,
        };
    }
    if (
        scope !== '' &&
        !!scope &&
        !c.buildConfig.scopedPluginTemplates?.[scope] &&
        !c.runtime._skipPluginScopeWarnings
    ) {
        logWarning(`Plugin ${pluginKey} is not recognized plugin in ${scope} scope`);
    } else if (scope && scopes) {
        let skipScope = false;
        if (parentScope) {
            const skipRnvOverrides = c.buildConfig.disableRnvDefaultOverrides;

            if (skipRnvOverrides && scope === 'rnv') {
                // Merges down to RNV defaults will be skipped
                skipScope = true;
            }
        }

        if (!skipScope) scopes.push(scope);
    }

    const parentPlugin = _getMergedPlugin(
        c,
        c.buildConfig.scopedPluginTemplates?.[scope]?.[pluginKey],
        pluginKey,
        scope,
        scopes,
        true
    );
    let currentPlugin: ConfigPluginSchema;
    if (typeof plugin === 'string' || plugin instanceof String) {
        currentPlugin = {};
    } else {
        currentPlugin = plugin;
    }

    if (currentPlugin.pluginDependencies) {
        Object.keys(currentPlugin.pluginDependencies).forEach((plugDepKey) => {
            if (currentPlugin.pluginDependencies?.[plugDepKey] === 'source:self') {
                currentPlugin.pluginDependencies[plugDepKey] = `source:${parentScope}`;
            }
        });
    }
    const mergedObj = mergeObjects<RnvPlugin>(c, parentPlugin, currentPlugin, true, true);
    if (c._renativePluginCache[pluginKey]) {
        mergedObj.config = c._renativePluginCache[pluginKey];
    }

    // IMPORTANT: only final top level merge should be sanitized
    const obj = skipSanitize
        ? mergedObj
        : sanitizeDynamicProps(mergedObj, {
              files: c.files,
              runtimeProps: c.runtime,
              props: c.buildConfig?._refs || {},
              configProps: c.injectableConfigProps,
          });

    // IMPORTANT: only final top level merge should be sanitized
    const mergedPlugin: RnvPlugin = skipSanitize
        ? obj
        : sanitizeDynamicProps(obj, {
              files: c.files,
              runtimeProps: c.runtime,
              props: obj.props || {},
              configProps: c.injectableConfigProps,
          });

    return mergedPlugin;
};

const _applyPackageDependency = (deps: Record<string, string>, key: string, version: string) => {
    const ctx = getContext();
    const { resolutions } = ctx.files.project.package;
    const res = resolutions?.[key];
    if (res) {
        logInfo(`Found resolutions override for ${key}@${res}`);
        deps[key] = res;
    } else {
        deps[key] = version;
    }
};

export const configurePlugins = async () => {
    logDefault('configurePlugins');

    const c = getContext();

    if (c.program.opts().skipDependencyCheck) return true;

    if (!c.files.project.package.dependencies) {
        c.files.project.package.dependencies = {};
    }

    // let hasPackageChanged = false;

    if (!c.buildConfig?.plugins) {
        return;
    }

    // const isTemplate = c.buildConfig?.isTemplate;
    // const newDeps: Record<string, string> = {};
    // const newDevDeps: Record<string, string> = {};
    const { dependencies, devDependencies } = c.files.project.package;
    // const ovMsg = isTemplate ? 'This is template. NO ACTION' : 'package.json will be overriden';

    Object.keys(c.buildConfig.plugins).forEach((k) => {
        const plugin = getMergedPlugin(c, k);

        if (!plugin) {
            if (c.buildConfig?.plugins?.[k] === null) {
                // Skip Warning as this is intentional "plugin":null override
            } else {
                logWarning(
                    `Plugin with name ${chalk().bold.white(
                        k
                    )} does not exists in ReNative source:rnv scope. you need to define it manually here: ${chalk().bold.white(
                        c.paths.project.builds.config
                    )}`
                );
            }
        } else if (
            plugin &&
            plugin.disabled !== true &&
            plugin.disableNpm !== true &&
            c.platform &&
            (plugin.supportedPlatforms ? plugin.supportedPlatforms.includes(c.platform) : true)
        ) {
            if (dependencies && dependencies[k]) {
                if (!plugin.version) {
                    if (!c.runtime._skipPluginScopeWarnings) {
                        logInfo(`Plugin ${k} not ready yet (waiting for scope ${plugin.scope}). SKIPPING...`);
                    }
                } else if (dependencies[k] !== plugin.version) {
                    //                 logWarning(
                    //                     `Version mismatch of dependency ${chalk().bold(k)} between:
                    // ${chalk().bold(c.paths.project.package)}: v(${chalk().red(dependencies[k])}) and
                    // ${chalk().bold(c.paths.project.builds.config)}: v(${chalk().green(plugin.version)}).
                    // ${ovMsg}`
                    //                 );

                    createDependencyMutation({
                        name: k,
                        original: {
                            version: dependencies[k],
                        },
                        updated: {
                            version: plugin.version,
                        },
                        type: 'dependencies',
                        msg: 'Version mismatch',
                        source: 'plugin (renative.json)',
                        targetPath: c.paths.project.package,
                    });

                    // hasPackageChanged = true;
                    // _applyPackageDependency(newDeps, k, plugin.version);
                }
            } else if (devDependencies && devDependencies[k]) {
                if (!plugin.version) {
                    if (!c.runtime._skipPluginScopeWarnings) {
                        logInfo(`Plugin ${k} not ready yet (waiting for scope ${plugin.scope}). SKIPPING...`);
                    }
                } else if (devDependencies[k] !== plugin.version) {
                    // logWarning(
                    //     `Version mismatch of devDependency ${chalk().bold(k)} between package.json: v(${chalk().red(
                    //         devDependencies[k]
                    //     )}) and plugins.json: v(${chalk().red(plugin.version)}). ${ovMsg}`
                    // );

                    createDependencyMutation({
                        name: k,
                        original: {
                            version: devDependencies[k],
                        },
                        updated: {
                            version: plugin.version,
                        },
                        type: 'devDependencies',
                        msg: 'Version mismatch',
                        source: 'plugin (renative.json)',
                        targetPath: c.paths.project.package,
                    });

                    // hasPackageChanged = true;
                    // _applyPackageDependency(newDevDeps, k, plugin.version);
                }
            } else {
                // Dependency does not exists
                if (plugin.version) {
                    // logInfo(
                    //     `Missing dependency ${chalk().bold(k)} v(${chalk().red(
                    //         plugin.version
                    //     )}) in package.json. ${ovMsg}`
                    // );

                    createDependencyMutation({
                        name: k,
                        updated: {
                            version: plugin.version,
                        },
                        // TODO: should be controlled by plugin if this devDependency
                        type: 'dependencies',
                        msg: 'Missing dependency',
                        source: 'plugin (renative.json)',
                        targetPath: c.paths.project.package,
                    });

                    // hasPackageChanged = true;
                    // if (plugin.version) {
                    //     _applyPackageDependency(newDeps, k, plugin.version);
                    // }
                }
            }
        }

        if (plugin && plugin.npm) {
            Object.keys(plugin.npm).forEach((npmKey) => {
                // const npmKey = _npmKey as NpmDepKey;
                const npmDep = plugin.npm?.[npmKey];
                // IMPORTANT: Do not override top level override with plugin.npm ones
                const topLevelPlugin = getMergedPlugin(c, npmKey);
                if (topLevelPlugin && topLevelPlugin?.version !== npmDep) {
                    logWarning(`RNV Detected plugin dependency conflict.
- ${npmKey}@${chalk().green(topLevelPlugin?.version)} ${chalk().cyan('<=')}
- ${k} .npm sub dependencies:
   |- ${npmKey}@${chalk().red(npmDep)}`);
                } else if (!dependencies[npmKey]) {
                    // logInfo(`Plugin ${chalk().bold(k)} requires npm dependency ${chalk().bold(npmKey)}. ${ovMsg}`);
                    if (npmDep) {
                        createDependencyMutation({
                            name: npmKey,
                            updated: {
                                version: npmDep,
                            },
                            // TODO: should be controlled by plugin if this devDependency
                            type: 'dependencies',
                            msg: 'Missing dependency',
                            source: 'plugin.npm (renative.json)',
                            targetPath: c.paths.project.package,
                        });
                        // _applyPackageDependency(newDeps, npmKey, npmDep);
                        // hasPackageChanged = true;
                    }
                } else if (dependencies[npmKey] !== npmDep) {
                    // logWarning(
                    //     `Plugin ${chalk().bold(k)} npm dependency ${chalk().bold(npmKey)} mismatch (${chalk().red(
                    //         dependencies[npmKey]
                    //     )}) => (${chalk().green(npmDep)}) .${ovMsg}`
                    // );
                    if (npmDep) {
                        createDependencyMutation({
                            name: npmKey,
                            original: {
                                version: dependencies[npmKey],
                            },
                            updated: {
                                version: npmDep,
                            },
                            // TODO: should be controlled by plugin if this devDependency
                            type: 'dependencies',
                            msg: 'Version mismatch',
                            source: 'plugin.npm (renative.json)',
                            targetPath: c.paths.project.package,
                        });
                        // _applyPackageDependency(newDeps, npmKey, npmDep);
                        // hasPackageChanged = true;
                    }
                }
            });
        }
    });

    // When in template we want warnings but NOT file overrides
    // if (isTemplate) return true;

    // console.log('SJSSJSLKJSSL', mutations);

    // c.runtime.skipPackageUpdate only reflects rnv version mismatch. should not prevent updating other deps
    //
    // if (hasPackageChanged /*! c.runtime.skipPackageUpdate */ && !c.program.opts().skipDependencyCheck) {
    //     _updatePackage(c, { dependencies: newDeps, devDependencies: newDevDeps });
    // }

    return true;
};

export const resolvePluginDependants = async () => {
    const c = getContext();

    logDefault('resolvePluginDependants');
    const { plugins } = c.buildConfig;

    if (plugins) {
        const pluginKeys = Object.keys(plugins);
        for (let i = 0; i < pluginKeys.length; i++) {
            const key = pluginKeys[i];
            await _resolvePluginDependencies(c, key, plugins[key]);
        }
    }

    return true;
};

const _resolvePluginDependencies = async (
    c: RnvContext,
    key: string,
    keyScope: ConfigPluginSchema | string,
    parentKey?: string
) => {
    // IMPORTANT: Do not cache this valuse as they need to be refreshed every
    // round in case new plugin has been installed and c.buildConfig generated
    if (keyScope === null) {
        return true;
    }

    const { scopedPluginTemplates } = c.buildConfig;
    const plugin = getMergedPlugin(c, key);

    const { scope } = _getPluginScope(keyScope);

    if (!plugin) {
        const depPlugin = scopedPluginTemplates?.[scope]?.[key];
        if (depPlugin) {
            // console.log('INSTALL PLUGIN???', key, depPlugin.source);
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: `Install ${key}?`,
                warningMessage: `Plugin ${chalk().bold.white(key)} source:${chalk().bold.white(
                    scope
                )} required by ${chalk().red(parentKey)} is not installed`,
            });
            if (confirm && c.files.project.config_original?.plugins) {
                c.files.project.config_original.plugins[key] = `source:${scope}`;
                writeRenativeConfigFile(c.paths.project.config, c.files.project.config_original);
                logSuccess(`Plugin ${key} sucessfully installed`);
                c._requiresNpmInstall = true;
            }
        } else {
            logWarning(
                `Plugin ${chalk().bold.white(parentKey)} requires ${chalk().red(
                    key
                )} which is not available in your system`
            );
        }
    } else {
        // All good
    }

    const deps = plugin?.pluginDependencies;
    if (deps) {
        const depsKeys = Object.keys(deps);
        for (let i = 0; i < depsKeys.length; i++) {
            const depKey = depsKeys[i];
            const depScope = deps[depKey];
            if (depScope) {
                await _resolvePluginDependencies(c, depKey, depScope, key);
            }
        }
    }
    return true;
};

export const parsePlugins = (
    pluginCallback: PluginCallback,
    ignorePlatformObjectCheck?: boolean,
    includeDisabledOrExcludedPlugins?: boolean
) => {
    const c = getContext();
    const { platform } = c;
    logDefault('parsePlugins');
    if (c.buildConfig && platform) {
        const includedPluginsConfig = getConfigProp('includedPlugins');
        // default to all plugins if it's not defined (null allowed for overrides)
        const includedPlugins = includedPluginsConfig === undefined ? ['*'] : includedPluginsConfig;

        const excludedPlugins = getConfigProp('excludedPlugins') || [];

        const handleActivePlugin = (plugin: RnvPlugin, pluginPlat: ConfigPluginPlatformSchema, key: string) => {
            // log deprecated if present
            if (plugin.deprecated) {
                logWarning(plugin.deprecated);
            }

            if (pluginCallback) {
                c.runtime.plugins[key] = plugin;
                if (plugin.version) {
                    c.runtime.pluginVersions[key] = plugin.version;
                }
                pluginCallback(plugin, pluginPlat, key);
            }
        };

        if (includedPlugins) {
            const { plugins } = c.buildConfig;
            if (plugins) {
                Object.keys(plugins).forEach((key) => {
                    const plugin = getMergedPlugin(c, key);
                    if (!plugin) return;

                    if (
                        (includedPlugins.includes('*') || includedPlugins.includes(key)) &&
                        !excludedPlugins.includes(key)
                    ) {
                        const pluginPlat: ConfigPluginPlatformSchema = plugin[platform] || {};

                        // NOTE: we do not want to disable plugin just because object is missing. instead we will let people to do it explicitly
                        // {
                        //     skipLinking: true,
                        //     disabled: true,
                        // };
                        //TODO: consider supportedPlatforms for plugins
                        const isPluginPlatDisabled = pluginPlat.disabled === true;
                        const isPluginDisabled = plugin.disabled === true;
                        const isPluginPlatSupported = plugin.supportedPlatforms
                            ? plugin.supportedPlatforms.includes(platform)
                            : true;

                        if (ignorePlatformObjectCheck || includeDisabledOrExcludedPlugins) {
                            if (isPluginDisabled) {
                                logDefault(`Plugin ${key} is marked disabled. skipping.`);
                            } else if (isPluginPlatDisabled) {
                                logDefault(`Plugin ${key} is marked disabled for platform ${platform}. skipping.`);
                            } else if (!isPluginPlatSupported) {
                                logDefault(
                                    `Plugin ${key}'s supportedPlatforms does not include ${platform}. skipping.`
                                );
                            }
                            handleActivePlugin(plugin, pluginPlat, key);
                        } else if (!isPluginPlatDisabled && !isPluginDisabled && isPluginPlatSupported) {
                            handleActivePlugin(plugin, pluginPlat, key);
                        }
                    } else if (includeDisabledOrExcludedPlugins) {
                        const pluginPlat = plugin[platform] || {};
                        if (excludedPlugins.includes(key)) {
                            plugin.disabled = true;
                            handleActivePlugin(plugin, pluginPlat, key);
                        }
                    }
                });
                // Not valid warning as web based plugins might not need web definition object to work
                // if (totalIncludedPlugins === 0) {
                //     logWarning(
                //         `Found plugins in your app but non are included. are you sure you added ${chalk().bold('includedPlugins')} in your renative.json config?`
                //     );
                // }
            } else {
                logError(`You have no plugins defined in ${chalk().bold.white(c.paths.project.builds.config)}`);
            }
        } else {
            logWarning(
                `You haven't included any ${chalk().bold.white(
                    '{ common: { includedPlugins: [] }}'
                )} in your ${chalk().bold.white(c.paths.appConfig.config)}. Your app might not work correctly`
            );
        }
    }
};

export const loadPluginTemplates = async () => {
    logDefault('loadPluginTemplates');

    const c = getContext();

    const customPluginTemplates = c.files.project.config?.paths?.pluginTemplates;
    if (customPluginTemplates) {
        const missingDeps = _parsePluginTemplateDependencies(c, customPluginTemplates);

        if (missingDeps.length) {
            const dependencies = c.files.project.package.dependencies || {};
            c.files.project.package.dependencies = dependencies;
            let hasPackageChanged = false;
            missingDeps.forEach((dep) => {
                const plugin = getMergedPlugin(c, dep);
                if (plugin?.version) {
                    hasPackageChanged = true;
                    _applyPackageDependency(dependencies, dep, plugin.version);
                } else {
                    // Unresolved Plugin
                }
            });
            // CHECK IF paths.pluginTemplates SCOPES are INSTALLED
            // This must be installed to avoid scoped plugins errors
            if (hasPackageChanged) {
                updatePackage({ dependencies });
                logInfo('Found missing dependency scopes. INSTALLING...');
                await installPackageDependencies();
                await loadPluginTemplates();
            } else {
                missingDeps.forEach((npmDep) => {
                    logWarning(`Plugin scope ${npmDep} does not exists in package.json.`);
                });
            }
        }
    }

    return true;
};

const _parsePluginTemplateDependencies = (
    c: RnvContext,
    customPluginTemplates: ConfigProjectPaths['pluginTemplates'],
    scope = 'root'
) => {
    logDefault('_parsePluginTemplateDependencies', `scope:${scope}`);
    const missingDeps: Array<string> = [];
    if (customPluginTemplates) {
        Object.keys(customPluginTemplates).forEach((k) => {
            const val = customPluginTemplates[k];
            if (val.npm) {
                const npmDep =
                    c.files.project.package?.dependencies?.[val.npm] ||
                    c.files.project.package?.devDependencies?.[val.npm];

                if (npmDep) {
                    let ptPath;
                    let ptConfig;
                    let ptRootPath;
                    if (npmDep.startsWith('file:')) {
                        ptPath = path.join(c.paths.project.dir, npmDep.replace('file:', ''), val.path || '');
                    } else {
                        ptRootPath = doResolve(val.npm);
                    }
                    if (ptRootPath) {
                        ptPath = path.join(ptRootPath, val.path);
                        c.paths.scopedConfigTemplates.pluginTemplatesDirs[k] = ptPath;
                        ptConfig = path.join(ptRootPath, RnvFileName.renativeTemplates);
                        if (!fsExistsSync(ptConfig)) {
                            // DEPRECATED Legacy Support
                            ptConfig = path.join(ptRootPath, val.path, 'renative.plugins.json');
                        }
                    }

                    if (fsExistsSync(ptConfig)) {
                        const ptConfigs = c.files.scopedConfigTemplates;
                        const ptConfigFile = readObjectSync<ConfigFileTemplates>(ptConfig);
                        if (ptConfigFile) {
                            ptConfigs[k] = ptConfigFile;
                        }

                        // _parsePluginTemplateDependencies(
                        //     c,
                        //     c.files.scopedPluginTemplates[k].pluginTemplateDependencies,
                        //     k
                        // );
                    } else {
                        logWarning(`Plugin scope ${val.npm} is not installed yet.`);
                    }
                } else {
                    // logWarning(`Plugin scope ${val.npm} does not exists in package.json.`);
                    missingDeps.push(val.npm);
                }
            }
        });
    }
    return missingDeps;
};

// const getCleanRegExString = str => str
//     .replace(/\(/g, '\\(')
//     .replace(/\)/g, '\\)')
//     .replace(/\^/g, '\\^')
//     .replace(/\?/g, '\\?')
//     .replace(/\|/g, '\\|')
//     .replace(/\*/g, '\\*')
//     .replace(/\|/g, '\\|')
//     .replace(/\[/g, '\\[')
//     .replace(/\]/g, '\\]')
//     .replace(/\{/g, '\\{')
//     .replace(/\}/g, '\\}')
//     .replace(/\+/g, '\\+')
//     .replace(/ /g, ' {1,}');
// Alternative Regex seem more accurate
const getCleanRegExString = (str: string) => str.replace(/[-\\.,_*+?^$[\](){}!=|`]/gi, '\\$&');

const _overridePlugin = (c: RnvContext, pluginsPath: string, dir: string) => {
    const source = path.join(pluginsPath, dir, 'overrides');

    const dest = doResolve(dir, false);
    if (!dest) return;

    const plugin = getMergedPlugin(c, dir);
    let flavourSource;
    if (plugin) {
        flavourSource = path.resolve(pluginsPath, dir, `overrides@${plugin.version}`);
    }

    if (flavourSource && fsExistsSync(flavourSource)) {
        logInfo(`${chalk().gray(dest)} overriden by: ${chalk().gray(flavourSource.split('node_modules').pop())}`);
        copyFolderContentsRecursiveSync(flavourSource, dest, false);
    } else if (fsExistsSync(source)) {
        logInfo(`${chalk().gray(dest)} overriden by: ${chalk().gray(source.split('node_modules').pop())}`);
        copyFolderContentsRecursiveSync(source, dest, false);
        // fsReaddirSync(pp).forEach((dir) => {
        //     copyFileSync(path.resolve(pp, file), path.resolve(c.paths.project.dir, 'node_modules', dir));
        // });
    } else {
        logDebug(
            `Your plugin configuration has no override path ${chalk().bold.white(
                source
            )}. skipping folder override action`
        );
    }

    let overridePath: string | undefined;
    if (plugin?.version) {
        const pluginVerArr = plugin.version.split('.');
        const pluginVersions: Array<string> = [];
        let prevVersion: string;
        pluginVerArr.forEach((v) => {
            if (prevVersion) {
                prevVersion = `${prevVersion}.${v}`;
            } else {
                prevVersion = `${v}`;
            }
            pluginVersions.push(prevVersion);
        });
        pluginVersions.reverse();

        for (let i = 0; i < pluginVersions.length; i++) {
            overridePath = path.resolve(pluginsPath, dir, `overrides@${pluginVersions[i]}.json`);
            if (fsExistsSync(overridePath)) {
                break;
            }
        }
    }

    if (overridePath && !fsExistsSync(overridePath)) {
        overridePath = path.resolve(pluginsPath, dir, 'overrides.json');
    }
    const overrideConfig = overridePath ? readObjectSync<ConfigFileOverrides>(overridePath) : null;
    const overrides = overrideConfig?.overrides;
    if (overrides) {
        Object.keys(overrides).forEach((k) => {
            const ovDir = path.join(dest, k);
            const override = overrides[k];

            if (fsExistsSync(ovDir)) {
                if (fsLstatSync(ovDir).isDirectory()) {
                    logWarning('overrides.json: Directories not supported yet. specify path to actual file');
                } else {
                    overrideFileContents(ovDir, override, overridePath);
                }
            }
        });
    }

    // const parentDest = path.join(dir, '..')
};
export const overrideFileContents = (dest: string, override: Record<string, string>, overridePath = '') => {
    const overrideDir = _ensureOverrideDirExists();
    const appliedOverrideFilePath = path.join(overrideDir, 'applied_overrides.json');

    const appliedOverrides = _readAppliedOverrides(appliedOverrideFilePath);

    if (fsExistsSync(dest)) {
        let fileToFix = fsReadFileSync(dest).toString();
        const { backupPath, isFirstRun } = _saveOriginalFile(dest, overrideDir);

        const fileKey = _getFileKey(dest);
        const previousOverride = appliedOverrides[fileKey] || {};
        const overridesChanged = JSON.stringify(previousOverride) !== JSON.stringify(override);

        if (overridesChanged && !isFirstRun) {
            revertOverrideToOriginal(dest, backupPath);
            fileToFix = fsReadFileSync(dest).toString();
        }
        let foundRegEx = false;
        const markerComment = '/*RNV*/';
        const failTerms: Array<string> = [];

        Object.keys(override).forEach((fk) => {
            const originalRegEx = new RegExp(`${getCleanRegExString(fk)}`, 'g');
            const overrideRegEx = new RegExp(`${getCleanRegExString(override[fk])}`, 'g');
            const originalExists = originalRegEx.test(fileToFix);
            const overrideExists = overrideRegEx.test(fileToFix);

            if (originalExists && !overrideExists) {
                foundRegEx = true;
                if (override[fk].startsWith('\n')) {
                    const newContent = `${markerComment}${override[fk]}${markerComment}`;
                    fileToFix = _isJavaScriptFile(dest)
                        ? fileToFix.replace(originalRegEx, `${fk}${newContent}`)
                        : fileToFix.replace(originalRegEx, `${fk}${override[fk]}`);
                } else {
                    fileToFix = fileToFix.replace(originalRegEx, `${override[fk]}`);
                }

                logSuccess(
                    `${chalk().bold.white(dest.split('node_modules').pop())} requires override by: ${chalk().bold.white(
                        overridePath.split('node_modules').pop()
                    )}. FIXING...DONE`
                );
            } else if (overrideExists) {
                logInfo(
                    `${chalk().gray(dest)} overridden by: ${chalk().gray(overridePath.split('node_modules').pop())}`
                );
            } else {
                failTerms.push(fk);
            }
        });

        if (!foundRegEx) {
            if (overridePath !== 'REACT_CORE_OVERRIDES') {
                failTerms.forEach((term) => {
                    logWarning(
                        `No Match found in ${chalk().red(
                            dest.split('node_modules').pop()
                        )} for expression: ${chalk().gray(term)}. Source: ${chalk().bold.white(
                            overridePath.split('node_modules').pop()
                        )}`
                    );
                });
            }
            // return;
        }

        if (overridesChanged) {
            appliedOverrides[fileKey] = override;
            fsWriteFileSync(dest, fileToFix);
            _writeAppliedOverrides(appliedOverrides, appliedOverrideFilePath);
        }
    } else {
        logDebug(`overrideFileContents Warning: path does not exist ${dest}`);
    }
};
const _saveOriginalFile = (dest: string, overrideDir: string) => {
    const nodeModulesIndex = dest.indexOf('node_modules');
    let isFirstRun = false;
    if (nodeModulesIndex === -1) {
        throw new Error('File path does not contain node_modules.');
    }
    const relativePathFromNodeModules = dest.substring(nodeModulesIndex + 'node_modules'.length);
    const backupPath = path.join(overrideDir, relativePathFromNodeModules);
    const buckupDir = path.dirname(backupPath);
    if (!fsExistsSync(buckupDir)) {
        fs.mkdirSync(buckupDir, { recursive: true });
    }

    if (!fsExistsSync(backupPath)) {
        fsCopyFileSync(dest, backupPath);
        isFirstRun = true;
    }
    return { backupPath, isFirstRun };
};

const _readBackupContent = (backupPath: string): string => {
    if (fsExistsSync(backupPath)) {
        return fsReadFileSync(backupPath).toString();
    }
    return '';
};

const _readAppliedOverrides = (apliedOverrideFilePath: string) => {
    if (fsExistsSync(apliedOverrideFilePath)) {
        return JSON.parse(fsReadFileSync(apliedOverrideFilePath).toString());
    }
    return {};
};
const _writeAppliedOverrides = (appliedOverrides: Record<string, string>, apliedOverrideFilePath: string) => {
    fsWriteFileSync(apliedOverrideFilePath, JSON.stringify(appliedOverrides, null, 2), 'utf8');
};

const _getFileKey = (dest: string): string => {
    const nodeModulesIndex = dest.indexOf('node_modules');
    if (nodeModulesIndex !== -1) {
        const parts = dest.substring(nodeModulesIndex).split(path.sep);
        const packageFilePathIndex =
            parts.findIndex((part) => !part.startsWith('@') && !part.startsWith('node_modules')) + 1;
        const relativeFilePath = parts.slice(packageFilePathIndex).join(path.sep);
        return relativeFilePath;
    }
    return dest;
};
const _ensureOverrideDirExists = () => {
    const c = getContext();
    const isMonorepo = getConfigRootProp('isMonorepo');
    const overrideDir = isMonorepo
        ? path.join(c.paths.project.dir, '../../.rnv', 'overrides')
        : path.join(c.paths.project.dir, '.rnv', 'overrides');

    if (!fsExistsSync(overrideDir)) {
        fsMkdirSync(overrideDir);
    }
    return overrideDir;
};
const revertOverrideToOriginal = (filePath: string, backupPath: string) => {
    const originalContent = _readBackupContent(backupPath);
    if (originalContent) {
        fsWriteFileSync(filePath, originalContent);
        logInfo(`Reverted ${filePath} to its original state before applying new overrides.`);
    } else {
        logWarning(`No original file found to revert for ${filePath}.`);
    }
};
const _isJavaScriptFile = (filePath: string) => {
    const ext = path.extname(filePath);
    return ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs'].includes(ext);
};
const _getPluginConfiguration = (c: RnvContext, pluginName: string) => {
    let renativePlugin: ConfigFilePlugin | undefined;
    let renativePluginPath;
    try {
        renativePluginPath = require.resolve(`${pluginName}/renative.plugin.json`, { paths: [c.paths.project.dir] });
    } catch {
        //
    }

    if (renativePluginPath) {
        renativePlugin = readObjectSync<ConfigFilePlugin>(renativePluginPath) || undefined;
    }
    return renativePlugin;
};

export const checkForPluginDependencies = async (postInjectHandler?: AsyncCallback) => {
    const c = getContext();

    const toAdd: Record<string, string> = {};
    if (!c.buildConfig.plugins) return;

    const bcPlugins = c.buildConfig.plugins;

    Object.keys(c.buildConfig.plugins).forEach((pluginName) => {
        const renativePluginConfig = _getPluginConfiguration(c, pluginName);

        if (renativePluginConfig) {
            c._renativePluginCache[pluginName] = renativePluginConfig;
        }

        const pluginDeps = renativePluginConfig?.pluginDependencies;
        if (pluginDeps) {
            // we have dependencies for this plugin
            Object.keys(pluginDeps).forEach((p) => {
                const plg = bcPlugins[pluginName];
                if (!bcPlugins[p] && typeof plg !== 'string' && plg.pluginDependencies?.[p] !== null) {
                    logWarning(`Plugin ${p} is not installed yet.`);
                    const pluginDep = pluginDeps[p];
                    if (pluginDep) {
                        toAdd[p] = pluginDep;
                        bcPlugins[p] = pluginDep;
                    }
                }
            });
        }
    });

    if (Object.keys(toAdd).length) {
        // ask the user
        let install = false;
        if (!c.program.opts().ci) {
            const answer = await inquirerPrompt({
                type: 'confirm',
                message: `Install ${Object.keys(toAdd).join(', ')}?`,
                warningMessage: `One or more dependencies are not installed: ${chalk().bold.white(
                    Object.keys(toAdd).join(', ')
                )}`,
            });
            install = answer.confirm;
        } else {
            logWarning('CI detected. Automatically installing dependencies');
            install = true;
        }

        if (install && c.files.project.config_original) {
            c.files.project.config_original.plugins = {
                ...(c.files.project.config_original.plugins || {}),
                ...toAdd,
            };
            writeRenativeConfigFile(c.paths.project.config, c.files.project.config_original);
            // Need to reload merged files
            await parseRenativeConfigs();
            await configurePlugins();
            if (postInjectHandler) {
                await postInjectHandler();
            }
        }
    }
};

// const getPluginPlatformFromString = (p: string): RnvPluginPlatform => p as RnvPluginPlatform;

export const overrideTemplatePlugins = async () => {
    logDefault('overrideTemplatePlugins');

    const c = getContext();

    const rnvPluginsDirs = c.paths.scopedConfigTemplates.pluginTemplatesDirs;
    const appPluginDirs = c.paths.appConfig.pluginDirs;

    parsePlugins((plugin, pluginPlat, key) => {
        if (!plugin.disablePluginTemplateOverrides) {
            if (plugin?._scopes?.length) {
                plugin._scopes.forEach((pluginScope) => {
                    const pluginOverridePath = rnvPluginsDirs[pluginScope];
                    if (pluginOverridePath) {
                        _overridePlugin(c, pluginOverridePath, key);
                    }
                });
            }
            if (appPluginDirs) {
                for (let k = 0; k < appPluginDirs.length; k++) {
                    _overridePlugin(c, appPluginDirs[k], key);
                }
            }
        } else {
            logInfo(
                `Plugin overrides disabled for: ${chalk().bold.white(
                    key
                )} with disablePluginTemplateOverrides. SKIPPING`
            );
        }
    }, true);
    return true;
};

export const copyTemplatePluginsSync = (c: RnvContext) => {
    const destPath = path.join(getAppFolder());

    logDefault('copyTemplatePluginsSync', `(${destPath})`);

    parsePlugins((plugin, pluginPlat, key) => {
        const objectInject: OverridesOptions = [...c.configPropsInjects];
        if (plugin.props) {
            Object.keys(plugin.props).forEach((v) => {
                objectInject.push({
                    pattern: `{{props.${v}}}`,
                    override: plugin.props?.[v],
                });
            });
        }

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        const sourcePath3 = getAppConfigBuildsFolder(path.join(c.paths.project.appConfigBase.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath3, destPath, true, undefined, false, objectInject);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN (PRIVATE)
        const sourcePath3sec = getAppConfigBuildsFolder(
            path.join(c.paths.workspace.project.appConfigBase.dir, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath3sec, destPath, true, undefined, false, objectInject);

        // FOLDER MERGES FROM APP CONFIG PLUGIN
        const sourcePath2 = getAppConfigBuildsFolder(path.join(c.paths.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2, destPath, true, undefined, false, objectInject);

        // FOLDER MERGES FROM APP CONFIG PLUGIN (PRIVATE)
        const sourcePath2sec = getAppConfigBuildsFolder(path.join(c.paths.workspace.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2sec, destPath, true, undefined, false, objectInject);

        // FOLDER MERGES FROM SCOPED PLUGIN TEMPLATES
        // NOTE: default 'rnv' scope (@rnv/config-templates) is included in pluginTemplatesDirs
        Object.keys(c.paths.scopedConfigTemplates.pluginTemplatesDirs).forEach((pathKey) => {
            const pluginTemplatePath = c.paths.scopedConfigTemplates.pluginTemplatesDirs[pathKey];
            const sourcePath4sec = getAppConfigBuildsFolder(path.join(pluginTemplatePath, key));
            copyFolderContentsRecursiveSync(sourcePath4sec, destPath, true, undefined, false, objectInject);
        });
    });
};

export const sanitizePluginPath = (str: string, name: string, mandatory?: boolean, options?: ResolveOptions) => {
    let newStr = str;
    try {
        if (str?.replace) {
            newStr = str.replace('{{PLUGIN_ROOT}}', doResolve(name, mandatory, options) || '');
        }
    } catch (e) {
        // Ignore
    }
    return newStr;
};

export const includesPluginPath = (str?: string) => {
    if (str?.includes) {
        return str.includes('{{PLUGIN_ROOT}}');
    }
    return false;
};

export const getLocalRenativePlugin = () => ({
    version: 'file:../packages/renative',
    webpack: {
        modulePaths: [],
        moduleAliases: {
            renative: {
                projectPath: 'packages/renative',
            },
        },
    },
});

export const updateRenativeConfigs = async () => {
    await loadPluginTemplates();
    await parseRenativeConfigs();
    return true;
};
