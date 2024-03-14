import merge from 'deepmerge';
import path from 'path';
import { getAppConfigBuildsFolder, getAppFolder } from '../context/contextProps';
import { parseRenativeConfigs } from '../configs';
import { configureFonts } from '../projects';
import {
    copyFolderContentsRecursiveSync,
    fsExistsSync,
    fsLstatSync,
    fsReadFileSync,
    fsWriteFileSync,
    mergeObjects,
    readObjectSync,
    sanitizeDynamicProps,
} from '../system/fs';
import { chalk, logDebug, logError, logInfo, logSuccess, logDefault, logWarning } from '../logger';
import { doResolve } from '../system/resolve';
import { RnvContext } from '../context/types';
import { PluginCallback, RnvPlugin, RnvPluginScope } from './types';
import { RenativeConfigPaths, RenativeConfigPlugin, RenativeConfigPluginPlatform } from '../schema/types';
import { inquirerPrompt } from '../api';
import { writeRenativeConfigFile } from '../configs/utils';
import { installPackageDependencies } from '../projects/npm';
import { OverridesOptions, ResolveOptions } from '../system/types';
import { ConfigFileOverrides, ConfigFilePlugin, ConfigFilePlugins } from '../schema/configFiles/types';
import { NpmPackageFile } from '../configs/types';
import { getContext } from '../context/provider';
import { getConfigProp } from '../context/contextProps';
import { ConfigName } from '../enums/configName';

const _getPluginScope = (plugin: RenativeConfigPlugin | string): RnvPluginScope => {
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
    plugin: RenativeConfigPlugin | string | undefined,
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
        !c.buildConfig.pluginTemplates?.[scope]?.pluginTemplates &&
        !c.runtime._skipPluginScopeWarnings
    ) {
        logWarning(`Plugin ${pluginKey} is not recognized plugin in ${scope} scope`);
    } else if (scope && scopes) {
        let skipScope = false;
        if (parentScope) {
            const skipRnvOverrides = c.buildConfig.pluginTemplates?.[parentScope]?.disableRnvDefaultOverrides;

            if (skipRnvOverrides && scope === 'rnv') {
                // Merges down to RNV defaults will be skipped
                skipScope = true;
            }
        }

        if (!skipScope) scopes.push(scope);
    }

    const parentPlugin = _getMergedPlugin(
        c,
        c.buildConfig.pluginTemplates?.[scope]?.pluginTemplates?.[pluginKey],
        pluginKey,
        scope,
        scopes,
        true
    );
    let currentPlugin: RenativeConfigPlugin;
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

    if (c.program.skipDependencyCheck) return true;

    if (!c.files.project.package.dependencies) {
        c.files.project.package.dependencies = {};
    }

    let hasPackageChanged = false;

    if (!c.buildConfig?.plugins) {
        return;
    }

    const isTemplate = c.buildConfig?.isTemplate;
    const newDeps: Record<string, string> = {};
    const newDevDeps: Record<string, string> = {};
    const { dependencies, devDependencies } = c.files.project.package;
    const ovMsg = isTemplate ? 'This is template. NO ACTION' : 'package.json will be overriden';
    Object.keys(c.buildConfig.plugins).forEach((k) => {
        const plugin = getMergedPlugin(c, k);

        if (!plugin) {
            if (c.buildConfig?.plugins?.[k] === null) {
                // Skip Warning as this is intentional "plugin":null override
            } else {
                logWarning(
                    `Plugin with name ${chalk().bold(
                        k
                    )} does not exists in ReNative source:rnv scope. you need to define it manually here: ${chalk().bold(
                        c.paths.project.builds.config
                    )}`
                );
            }
        } else if (
            plugin && plugin.disabled !== true && plugin.disableNpm !== true && c.platform && plugin.supportedPlatforms
                ? plugin.supportedPlatforms.includes(c.platform)
                : true
        ) {
            if (dependencies && dependencies[k]) {
                if (!plugin.version) {
                    if (!c.runtime._skipPluginScopeWarnings) {
                        logInfo(`Plugin ${k} not ready yet (waiting for scope ${plugin.scope}). SKIPPING...`);
                    }
                } else if (dependencies[k] !== plugin.version) {
                    logWarning(
                        `Version mismatch of dependency ${chalk().bold(k)} between:
    ${chalk().bold(c.paths.project.package)}: v(${chalk().red(dependencies[k])}) and
    ${chalk().bold(c.paths.project.builds.config)}: v(${chalk().green(plugin.version)}).
    ${ovMsg}`
                    );

                    hasPackageChanged = true;
                    _applyPackageDependency(newDeps, k, plugin.version);
                }
            } else if (devDependencies && devDependencies[k]) {
                if (!plugin.version) {
                    if (!c.runtime._skipPluginScopeWarnings) {
                        logInfo(`Plugin ${k} not ready yet (waiting for scope ${plugin.scope}). SKIPPING...`);
                    }
                } else if (devDependencies[k] !== plugin.version) {
                    logWarning(
                        `Version mismatch of devDependency ${chalk().bold(k)} between package.json: v(${chalk().red(
                            devDependencies[k]
                        )}) and plugins.json: v(${chalk().red(plugin.version)}). ${ovMsg}`
                    );
                    hasPackageChanged = true;
                    _applyPackageDependency(newDevDeps, k, plugin.version);
                }
            } else {
                // Dependency does not exists
                if (plugin.version) {
                    logInfo(
                        `Missing dependency ${chalk().bold(k)} v(${chalk().red(
                            plugin.version
                        )}) in package.json. ${ovMsg}`
                    );

                    hasPackageChanged = true;
                    if (plugin.version) {
                        _applyPackageDependency(newDeps, k, plugin.version);
                    }
                }
            }
        }

        if (plugin && plugin.npm) {
            Object.keys(plugin.npm).forEach((npmKey) => {
                const npmDep = plugin.npm?.[npmKey];
                // IMPORTANT: Do not override top level override with plugin.npm ones
                const topLevelPlugin = getMergedPlugin(c, npmKey);
                if (topLevelPlugin && topLevelPlugin?.version !== npmDep) {
                    logInfo(`RNV Detected plugin dependency conflict. ${chalk().cyan('RESOLVING...')}
- ${npmKey}@${chalk().green(topLevelPlugin?.version)} ${chalk().cyan('<=')}
- ${k} .npm sub dependencies:
   |- ${npmKey}@${chalk().red(npmDep)}`);
                } else if (!dependencies[npmKey]) {
                    logInfo(`Plugin ${chalk().bold(k)} requires npm dependency ${chalk().bold(npmKey)}. ${ovMsg}`);
                    if (npmDep) {
                        _applyPackageDependency(newDeps, npmKey, npmDep);
                        hasPackageChanged = true;
                    }
                } else if (dependencies[npmKey] !== npmDep) {
                    logWarning(
                        `Plugin ${chalk().bold(k)} npm dependency ${chalk().bold(npmKey)} mismatch (${chalk().red(
                            dependencies[npmKey]
                        )}) => (${chalk().green(npmDep)}) .${ovMsg}`
                    );
                    if (npmDep) {
                        _applyPackageDependency(newDeps, npmKey, npmDep);
                        hasPackageChanged = true;
                    }
                }
            });
        }
    });

    // When in template we want warnings but NOT file overrides
    if (isTemplate) return true;

    // c.runtime.skipPackageUpdate only reflects rnv version mismatch. should not prevent updating other deps
    if (hasPackageChanged /*! c.runtime.skipPackageUpdate */ && !c.program.skipDependencyCheck) {
        _updatePackage(c, { dependencies: newDeps, devDependencies: newDevDeps });
    }

    return true;
};

const _updatePackage = (c: RnvContext, override: Partial<NpmPackageFile>) => {
    const newPackage: NpmPackageFile = merge(c.files.project.package, override);
    writeRenativeConfigFile(c.paths.project.package, newPackage);
    c.files.project.package = newPackage;
    c._requiresNpmInstall = true;
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
    keyScope: RenativeConfigPlugin | string,
    parentKey?: string
) => {
    // IMPORTANT: Do not cache this valuse as they need to be refreshed every
    // round in case new plugin has been installed and c.buildConfig generated
    if (keyScope === null) {
        return true;
    }

    const { pluginTemplates } = c.buildConfig;
    const plugin = getMergedPlugin(c, key);

    const { scope } = _getPluginScope(keyScope);

    if (!plugin) {
        const depPlugin = pluginTemplates?.[scope]?.pluginTemplates?.[key];
        if (depPlugin) {
            // console.log('INSTALL PLUGIN???', key, depPlugin.source);
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: `Install ${key}?`,
                warningMessage: `Plugin ${chalk().bold(key)} source:${chalk().bold(scope)} required by ${chalk().red(
                    parentKey
                )} is not installed`,
            });
            if (confirm && c.files.project.config_original?.plugins) {
                c.files.project.config_original.plugins[key] = `source:${scope}`;
                writeRenativeConfigFile(c.paths.project.config, c.files.project.config_original);
                logSuccess(`Plugin ${key} sucessfully installed`);
                c._requiresNpmInstall = true;
            }
        } else {
            logWarning(
                `Plugin ${chalk().bold(parentKey)} requires ${chalk().red(key)} which is not available in your system`
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

        const handleActivePlugin = (plugin: RnvPlugin, pluginPlat: RenativeConfigPluginPlatform, key: string) => {
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
                        const pluginPlat = plugin[platform] || {};

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
                                logInfo(`Plugin ${key} is marked disabled. skipping.`);
                            } else if (isPluginPlatDisabled) {
                                logInfo(`Plugin ${key} is marked disabled for platform ${platform} skipping.`);
                            } else if (!isPluginPlatSupported) {
                                logInfo(`Plugin ${key} supportedPlatforms does not include ${platform} skipping.`);
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
                logError(`You have no plugins defined in ${chalk().bold(c.paths.project.builds.config)}`);
            }
        } else {
            logWarning(
                `You haven't included any ${chalk().bold('{ common: { includedPlugins: [] }}')} in your ${chalk().bold(
                    c.paths.appConfig.config
                )}. Your app might not work correctly`
            );
        }
    }
};

export const loadPluginTemplates = async () => {
    logDefault('loadPluginTemplates');

    const c = getContext();

    //This comes from project dependency
    let flexnPluginsPath = doResolve('@flexn/plugins');

    if (!fsExistsSync(flexnPluginsPath)) {
        //This comes from rnv built-in dependency (installed via npm)
        flexnPluginsPath = path.resolve(__dirname, '../../node_modules/@flexn/plugins');
        if (!fsExistsSync(flexnPluginsPath)) {
            //This comes from rnv built-in dependency (installed via yarn might install it one level up)
            flexnPluginsPath = path.resolve(__dirname, '../../../@flexn/plugins');
            if (!fsExistsSync(flexnPluginsPath)) {
                // This comes from rnv built-in dependency (installed via yarn might install it 2 level up but scoped to @rnv)
                flexnPluginsPath = path.resolve(__dirname, '../../../../@flexn/plugins');
                if (!fsExistsSync(flexnPluginsPath)) {
                    return Promise.reject(`RNV Cannot find package: ${chalk().bold(flexnPluginsPath)}`);
                }
            }
        }
    }

    if (!flexnPluginsPath) return Promise.reject(`flexnPluginsPath missing`);

    const flexnPluginTemplatesPath = path.join(flexnPluginsPath, 'pluginTemplates');

    const flexnPluginTemplates = readObjectSync<ConfigFilePlugins>(
        path.join(flexnPluginTemplatesPath, 'renative.plugins.json')
    );
    const rnvPluginTemplates = readObjectSync<ConfigFilePlugins>(c.paths.rnv.pluginTemplates.config);

    const cnf = merge(flexnPluginTemplates || {}, rnvPluginTemplates || {});

    if (cnf) {
        c.files.rnv.pluginTemplates.config = cnf;
        c.files.rnv.pluginTemplates.configs = {
            rnv: cnf,
        };
    }

    //Override default rnv path with flexn one and add it rnv as overrider
    c.paths.rnv.pluginTemplates.dirs = {
        rnv: flexnPluginTemplatesPath,
    };

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
                _updatePackage(c, { dependencies });
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
    customPluginTemplates: RenativeConfigPaths['pluginTemplates'],
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
                    if (npmDep.startsWith('file:')) {
                        ptPath = path.join(c.paths.project.dir, npmDep.replace('file:', ''), val.path || '');
                    } else {
                        // ptPath = path.join(c.paths.project.nodeModulesDir, val.npm, val.path || '');
                        ptPath = `${doResolve(val.npm)}/${val.path}`;
                    }

                    const ptConfig = path.join(ptPath, ConfigName.renativePlugins);
                    c.paths.rnv.pluginTemplates.dirs[k] = ptPath;
                    if (fsExistsSync(ptConfig)) {
                        const ptConfigs = c.files.rnv.pluginTemplates.configs;
                        const ptConfigFile = readObjectSync<ConfigFilePlugins>(ptConfig);
                        if (ptConfigFile) {
                            ptConfigs[k] = ptConfigFile;
                        }

                        // _parsePluginTemplateDependencies(
                        //     c,
                        //     c.files.rnv.pluginTemplates.configs[k].pluginTemplateDependencies,
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
            `Your plugin configuration has no override path ${chalk().bold(source)}. skipping folder override action`
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
    if (fsExistsSync(dest)) {
        let fileToFix = fsReadFileSync(dest).toString();

        let foundRegEx = false;
        const failTerms: Array<string> = [];
        Object.keys(override).forEach((fk) => {
            const regEx = new RegExp(`${getCleanRegExString(fk)}`, 'g');
            const count = (fileToFix.match(regEx) || []).length;

            if (!count) {
                const overrided = override[fk];
                const regEx2 = new RegExp(getCleanRegExString(overrided), 'g');
                const count2 = (fileToFix.match(regEx2) || []).length;

                if (!count2) {
                    failTerms.push(fk);
                } else {
                    foundRegEx = true;
                    logInfo(
                        `${chalk().gray(dest)} overriden by: ${chalk().gray(overridePath.split('node_modules').pop())}`
                    );
                }
            } else {
                foundRegEx = true;
                fileToFix = fileToFix.replace(regEx, override[fk]);
                logSuccess(
                    `${chalk().bold(dest.split('node_modules').pop())} requires override by: ${chalk().bold(
                        overridePath.split('node_modules').pop()
                    )}. FIXING...DONE`
                );
            }
        });
        if (!foundRegEx) {
            if (overridePath !== 'REACT_CORE_OVERRIDES') {
                // We only warn against user defined overrides.
                failTerms.forEach((term) => {
                    logWarning(
                        `No Match found in ${chalk().red(
                            dest.split('node_modules').pop()
                        )} for expression: ${chalk().gray(term)}. source: ${chalk().bold(
                            overridePath.split('node_modules').pop()
                        )}`
                    );
                });
            }
            return;
        }
        fsWriteFileSync(dest, fileToFix);
    } else {
        logDebug(`overrideFileContents Warning: path does not exists ${dest}`);
    }
};

export const installPackageDependenciesAndPlugins = async () => {
    logDefault('installPackageDependenciesAndPlugins');

    await installPackageDependencies();
    await overrideTemplatePlugins();
    await configureFonts();
    await checkForPluginDependencies();
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

export const checkForPluginDependencies = async () => {
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
        if (!c.program.ci) {
            const answer = await inquirerPrompt({
                type: 'confirm',
                message: `Install ${Object.keys(toAdd).join(', ')}?`,
                warningMessage: `One or more dependencies are not installed: ${chalk().bold(
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
            await installPackageDependenciesAndPlugins();
        }
    }
};

// const getPluginPlatformFromString = (p: string): RnvPluginPlatform => p as RnvPluginPlatform;

export const overrideTemplatePlugins = async () => {
    logDefault('overrideTemplatePlugins');

    const c = getContext();

    const rnvPluginsDirs = c.paths.rnv.pluginTemplates.dirs;
    const appPluginDirs = c.paths.appConfig.pluginDirs;

    parsePlugins((plugin, pluginPlat, key) => {
        if (!plugin.disablePluginTemplateOverrides) {
            if (plugin?._scopes?.length) {
                plugin._scopes.forEach((pluginScope) => {
                    const pluginOverridePath = rnvPluginsDirs[pluginScope];
                    if (pluginOverridePath) {
                        const rnvOverridePath = path.join(c.paths.rnv.pluginTemplates.overrideDir!, key);
                        if (fsExistsSync(rnvOverridePath)) {
                            _overridePlugin(c, c.paths.rnv.pluginTemplates.overrideDir!, key);
                        } else {
                            _overridePlugin(c, pluginOverridePath, key);
                        }
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
                `Plugin overrides disabled for: ${chalk().bold(key)} with disablePluginTemplateOverrides. SKIPPING`
            );
        }
    }, true);
    return true;
};

export const copyTemplatePluginsSync = (c: RnvContext) => {
    const destPath = path.join(getAppFolder());

    logDefault('copyTemplatePluginsSync', `(${destPath})`);

    parsePlugins((plugin, pluginPlat, key) => {
        const objectInject: OverridesOptions = []; // = { ...c.configPropsInjects };
        if (plugin.props) {
            Object.keys(plugin.props).forEach((v) => {
                objectInject.push({
                    pattern: `{{props.${v}}}`,
                    override: plugin.props?.[v],
                });
            });
        }
        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        // if (c.paths.rnv.pluginTemplates.dir) {
        //     const sourcePathRnvPlugin = getAppConfigBuildsFolder(c, platform, path.join(c.paths.rnv.pluginTemplates.dir, key));
        //     copyFolderContentsRecursiveSync(sourcePathRnvPlugin, destPath, true, undefined, false, objectInject);
        // }

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
        Object.keys(c.paths.rnv.pluginTemplates.dirs).forEach((pathKey) => {
            if (pathKey !== 'rnv') {
                const pluginTemplatePath = c.paths.rnv.pluginTemplates.dirs[pathKey];

                const sourcePath4sec = getAppConfigBuildsFolder(path.join(pluginTemplatePath, key));
                copyFolderContentsRecursiveSync(sourcePath4sec, destPath, true, undefined, false, objectInject);
            }
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
