import merge from 'deepmerge';
import path from 'path';
import intersection from 'lodash.intersection';
import { getAppFolder, getBuildsFolder, getConfigProp } from '../common';
import { parseRenativeConfigs, writeRenativeConfigFile } from '../configs';
import { INJECTABLE_CONFIG_PROPS, RENATIVE_CONFIG_PLUGINS_NAME } from '../constants';
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
import { chalk, logDebug, logError, logInfo, logSuccess, logTask, logWarning } from '../logger';
import { installPackageDependencies } from '../npm';
import { doResolve, doResolvePath } from '../system/resolve';
import { RnvContext } from '../context/types';
import { PluginCallback, PluginListResponse, RnvPlugin, RnvPluginScope, RnvPluginWebpackKey } from './types';
import { RenativeConfigPlugin, RenativeWebpackConfig } from '../schema/ts/types';
import { RnvModuleConfig, RnvPlatform } from '../types';
import { inquirerPrompt } from '../api';
import { ResolveOptions } from '../api/types';

export const getPluginList = (c: RnvContext, isUpdate = false) => {
    const output: PluginListResponse = {
        asString: '',
        asArray: [],
        plugins: [],
        allPlugins: {}, // this is used by taskRnvPluginAdd
    };

    let i = 1;

    Object.keys(c.files.rnv.pluginTemplates.configs).forEach((pk) => {
        const plugins = c.files.rnv.pluginTemplates.configs[pk].pluginTemplates;
        Object.keys(plugins).forEach((k) => {
            const p = plugins[k];

            let platforms = '';
            const pluginPlatforms = intersection(
                c.runtime.supportedPlatforms.map((pl) => pl.platform),
                Object.keys(p)
            );
            pluginPlatforms.forEach((v) => {
                platforms += `${v}, `;
            });
            if (platforms.length) {
                platforms = platforms.slice(0, platforms.length - 2);
            }
            const installedPlugin = c.buildConfig && c.buildConfig.plugins && c.buildConfig.plugins[k];
            const installedString = installedPlugin ? chalk().yellow('installed') : chalk().green('not installed');
            if (isUpdate && installedPlugin) {
                output.plugins.push(k);
                let versionString;
                const installedPluginVersion =
                    typeof installedPlugin !== 'string' ? installedPlugin.version : installedPlugin;
                if (installedPluginVersion !== p.version) {
                    versionString = `(${chalk().yellow(installedPluginVersion)}) => (${chalk().green(p.version)})`;
                } else {
                    versionString = `(${chalk().green(installedPluginVersion)})`;
                }
                output.asString += ` [${i}]> ${chalk().bold(k)} ${versionString}\n`;
                output.asArray.push({
                    name: `${k} ${versionString}`,
                    value: k,
                });
                output.allPlugins[k] = p; // this is used by taskRnvPluginAdd
                i++;
            } else if (!isUpdate) {
                output.plugins.push(k);
                output.asString += ` [${i}]> ${chalk().bold(k)} (${chalk().grey(
                    p['no-npm'] ? 'no-npm' : p.version
                )}) [${platforms}] - ${installedString}\n`;
                output.asArray.push({
                    name: `${k} (${chalk().grey(
                        p['no-npm'] ? 'no-npm' : p.version
                    )}) [${platforms}] - ${installedString}`,
                    value: k,
                });
                output.allPlugins[k] = p; // this is used by taskRnvPluginAdd

                i++;
            }
            output.asArray.sort((a, b) => {
                const aStr = a.name.toLowerCase();
                const bStr = b.name.toLowerCase();
                let com = 0;
                if (aStr > bStr) {
                    com = 1;
                } else if (aStr < bStr) {
                    com = -1;
                }
                return com;
            });
        });
    });

    return output;
};

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
    INJECTABLE_CONFIG_PROPS.forEach((v) => {
        c.configPropsInjects[v] = getConfigProp(c, c.platform, v);
    });
    if (currentPlugin.pluginDependencies) {
        Object.keys(currentPlugin.pluginDependencies).forEach((plugDepKey) => {
            if (currentPlugin.pluginDependencies?.[plugDepKey] === 'source:self') {
                currentPlugin.pluginDependencies[plugDepKey] = `source:${parentScope}`;
            }
        });
    }
    const mergedObj = mergeObjects(c, parentPlugin, currentPlugin, true, true);
    if (c._renativePluginCache[pluginKey]) {
        mergedObj.config = c._renativePluginCache[pluginKey];
    }

    // IMPORTANT: only final top level merge should be sanitized
    const obj = skipSanitize
        ? mergedObj
        : sanitizeDynamicProps(mergedObj, {
              files: c.files,
              runtimeProps: c.runtime,
              props: c.buildConfig?._refs,
              configProps: c.configPropsInjects,
          });

    // IMPORTANT: only final top level merge should be sanitized
    const mergedPlugin: RnvPlugin = skipSanitize
        ? obj
        : sanitizeDynamicProps(obj, {
              files: c.files,
              runtimeProps: c.runtime,
              props: obj.props,
              configProps: c.configPropsInjects,
          });

    return mergedPlugin;
};

export const configurePlugins = async (c: RnvContext) => {
    logTask('configurePlugins');

    if (c.program.skipDependencyCheck) return true;

    if (!c.files.project.package.dependencies) {
        c.files.project.package.dependencies = {};
    }

    let hasPackageChanged = false;

    if (!c.buildConfig?.plugins) {
        return;
    }

    const { isTemplate } = c.files.project.config;
    const newDeps: Record<string, string | undefined> = {};
    const newDevDeps: Record<string, string> = {};
    const { dependencies, devDependencies } = c.files.project.package;
    const ovMsg = isTemplate ? 'This is template. NO ACTION' : 'package.json will be overriden';
    Object.keys(c.buildConfig.plugins).forEach((k) => {
        const plugin = getMergedPlugin(c, k);

        if (!plugin) {
            if (c.buildConfig?.plugins?.[k] === null) {
                // Skip Warning as this is intentional "plugin":null
            } else {
                logWarning(
                    `Plugin with name ${chalk().white(
                        k
                    )} does not exists in ReNative source:rnv scope. you need to define it manually here: ${chalk().white(
                        c.paths.project.builds.config
                    )}`
                );
            }
        } else if (dependencies && dependencies[k]) {
            if (plugin.disabled !== true && plugin['no-npm'] !== true) {
                if (!plugin.version) {
                    if (!c.runtime._skipPluginScopeWarnings) {
                        logInfo(`Plugin ${k} not ready yet (waiting for scope ${plugin.scope}). SKIPPING...`);
                    }
                } else if (dependencies[k] !== plugin.version) {
                    logWarning(
                        `Version mismatch of dependency ${chalk().white(k)} between:
${chalk().white(c.paths.project.package)}: v(${chalk().red(dependencies[k])}) and
${chalk().white(c.paths.project.builds.config)}: v(${chalk().green(plugin.version)}).
${ovMsg}`
                    );

                    hasPackageChanged = true;
                    newDeps[k] = plugin.version;
                }
            }
        } else if (devDependencies && devDependencies[k]) {
            if (plugin.disabled !== true && plugin['no-npm'] !== true) {
                if (!plugin.version) {
                    if (!c.runtime._skipPluginScopeWarnings) {
                        logInfo(`Plugin ${k} not ready yet (waiting for scope ${plugin.scope}). SKIPPING...`);
                    }
                } else if (devDependencies[k] !== plugin.version) {
                    logWarning(
                        `Version mismatch of devDependency ${chalk().white(k)} between package.json: v(${chalk().red(
                            devDependencies[k]
                        )}) and plugins.json: v(${chalk().red(plugin.version)}). ${ovMsg}`
                    );
                    hasPackageChanged = true;
                    newDevDeps[k] = plugin.version;
                }
            }
        } else if (plugin.disabled !== true && plugin['no-npm'] !== true) {
            // Dependency does not exists
            if (plugin.version) {
                logInfo(
                    `Missing dependency ${chalk().white(k)} v(${chalk().red(plugin.version)}) in package.json. ${ovMsg}`
                );

                hasPackageChanged = true;
                newDeps[k] = plugin.version;
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
                    logInfo(`Plugin ${chalk().white(k)} requires npm dependency ${chalk().white(npmKey)}. ${ovMsg}`);
                    newDeps[npmKey] = npmDep;
                    hasPackageChanged = true;
                } else if (dependencies[npmKey] !== npmDep) {
                    logWarning(
                        `Plugin ${chalk().white(k)} npm dependency ${chalk().white(npmKey)} mismatch (${chalk().red(
                            dependencies[npmKey]
                        )}) => (${chalk().green(npmDep)}) .${ovMsg}`
                    );
                    newDeps[npmKey] = npmDep;
                    hasPackageChanged = true;
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

const _updatePackage = (c: RnvContext, override: any) => {
    const newPackage: any = merge(c.files.project.package, override);
    writeRenativeConfigFile(c, c.paths.project.package, newPackage);
    c.files.project.package = newPackage;
    c._requiresNpmInstall = true;
};

export const resolvePluginDependants = async (c: RnvContext) => {
    logTask('resolvePluginDependants');
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
                warningMessage: `Plugin ${chalk().white(key)} source:${chalk().white(scope)} required by ${chalk().red(
                    parentKey
                )} is not installed`,
            });
            if (confirm) {
                c.files.project.config_original.plugins[key] = `source:${scope}`;
                writeRenativeConfigFile(c, c.paths.project.config, c.files.project.config_original);
                logSuccess(`Plugin ${key} sucessfully installed`);
                c._requiresNpmInstall = true;
            }
        } else {
            logWarning(
                `Plugin ${chalk().white(parentKey)} requires ${chalk().red(key)} which is not available in your system`
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
    c: RnvContext,
    platform: RnvPlatform,
    pluginCallback: PluginCallback,
    ignorePlatformObjectCheck?: boolean
) => {
    logTask('parsePlugins');
    if (c.buildConfig && platform) {
        const includedPlugins = getConfigProp(c, platform, 'includedPlugins', []);
        const excludedPlugins = getConfigProp(c, platform, 'excludedPlugins', []);
        if (includedPlugins) {
            const { plugins } = c.buildConfig;
            if (plugins) {
                // let totalIncludedPlugins = 0;
                Object.keys(plugins).forEach((key) => {
                    if (
                        (includedPlugins.includes('*') || includedPlugins.includes(key)) &&
                        !excludedPlugins.includes(key)
                    ) {
                        const plugin = getMergedPlugin(c, key);

                        if (plugin) {
                            const pluginPlat = plugin[platform] || {};
                            // NOTE: we do not want to disable plugin just because object is missing. instead we will let people to do it explicitly
                            // {
                            //     skipLinking: true,
                            //     disabled: true,
                            //     enabled: false,
                            // };
                            if (ignorePlatformObjectCheck) {
                                // totalIncludedPlugins++;
                                pluginCallback(plugin, pluginPlat, key);
                            } else if (pluginPlat) {
                                const isPluginDisabled = plugin.disabled === true || plugin.enabled === false;
                                //DEPreCATED
                                const isPluginPlatDisabled =
                                    pluginPlat.disabled === true || pluginPlat.enabled === false;
                                if (!isPluginDisabled && !isPluginPlatDisabled) {
                                    if (plugin.deprecated) {
                                        logWarning(plugin.deprecated);
                                    }
                                    if (pluginCallback) {
                                        // totalIncludedPlugins++;
                                        pluginCallback(plugin, pluginPlat, key);
                                    }
                                } else {
                                    if (isPluginDisabled) {
                                        logInfo(`Plugin ${key} is marked disabled. skipping.`);
                                    } else if (isPluginPlatDisabled) {
                                        logInfo(`Plugin ${key} is marked disabled for platform ${platform} skipping.`);
                                    }
                                }
                            }
                        }
                    }
                });
                // Not valid warning as web based plugins might not need web definition object to work
                // if (totalIncludedPlugins === 0) {
                //     logWarning(
                //         `Found plugins in your app but non are included. are you sure you added ${chalk().white('includedPlugins')} in your renative.json config?`
                //     );
                // }
            } else {
                logError(`You have no plugins defined in ${chalk().white(c.paths.project.builds.config)}`);
            }
        } else {
            logWarning(
                `You haven't included any ${chalk().white(
                    '{ common: { includedPlugins: [] }}'
                )} in your ${chalk().white(c.paths.appConfig.config)}. Your app might not work correctly`
            );
        }
    }
};

export const loadPluginTemplates = async (c: RnvContext) => {
    logTask('loadPluginTemplates');

    //This comes from project dependency
    let flexnPluginsPath = doResolve('@flexn/plugins');

    if (!fsExistsSync(flexnPluginsPath)) {
        //This comes from rnv built-in dependency (installed via npm)
        flexnPluginsPath = path.resolve(__dirname, '../../node_modules/@flexn/plugins');
        if (!fsExistsSync(flexnPluginsPath)) {
            //This comes from rnv built-in dependency (installed via yarn might install it one level up)
            flexnPluginsPath = path.resolve(__dirname, '../../../@flexn/plugins');
            if (!fsExistsSync(flexnPluginsPath)) {
                return Promise.reject(`RNV Cannot find package: ${chalk().white(flexnPluginsPath)}`);
            }
        }
    }

    if (!flexnPluginsPath) return Promise.reject(`flexnPluginsPath missing`);

    const flexnPluginTemplatesPath = path.join(flexnPluginsPath, 'pluginTemplates');

    const flexnPluginTemplates = readObjectSync(path.join(flexnPluginTemplatesPath, 'renative.plugins.json'));
    const rnvPluginTemplates = readObjectSync(c.paths.rnv.pluginTemplates.config);

    c.files.rnv.pluginTemplates.config = merge(flexnPluginTemplates, rnvPluginTemplates);

    c.files.rnv.pluginTemplates.configs = {
        rnv: c.files.rnv.pluginTemplates.config,
    };

    //Override default rnv path with flexn one and add it rnv as overrider
    c.paths.rnv.pluginTemplates.dirs = {
        rnv: flexnPluginTemplatesPath,
    };

    const customPluginTemplates = c.files.project.config?.paths?.pluginTemplates;
    const missingDeps = _parsePluginTemplateDependencies(c, customPluginTemplates);
    if (missingDeps.length) {
        const { dependencies } = c.files.project.package;
        let hasPackageChanged = false;
        missingDeps.forEach((dep) => {
            const plugin = getMergedPlugin(c, dep);
            if (plugin) {
                hasPackageChanged = true;
                dependencies[dep] = plugin.version;
            } else {
                // Unresolved Plugin
            }
        });
        // CHECK IF paths.pluginTemplates SCOPES are INSTALLED
        // This must be installed to avoid scoped plugins errors
        if (hasPackageChanged) {
            _updatePackage(c, { dependencies });
            logInfo('Found missing dependency scopes. INSTALLING...');
            await installPackageDependencies(c);
            await loadPluginTemplates(c);
        } else {
            missingDeps.forEach((npmDep) => {
                logWarning(`Plugin scope ${npmDep} does not exists in package.json.`);
            });
        }
    }
    return true;
};

const _parsePluginTemplateDependencies = (
    c: RnvContext,
    customPluginTemplates: Record<string, { npm: string; path: string }>,
    scope = 'root'
) => {
    logTask('_parsePluginTemplateDependencies', `scope:${scope}`);
    const missingDeps: Array<string> = [];
    if (customPluginTemplates) {
        Object.keys(customPluginTemplates).forEach((k) => {
            const val = customPluginTemplates[k];
            if (val.npm) {
                const npmDep =
                    c.files.project.package?.dependencies?.[val.npm] ||
                    c.files.project.package?.devDependencies[val.npm];

                if (npmDep) {
                    let ptPath;
                    if (npmDep.startsWith('file:')) {
                        ptPath = path.join(c.paths.project.dir, npmDep.replace('file:', ''), val.path || '');
                    } else {
                        // ptPath = path.join(c.paths.project.nodeModulesDir, val.npm, val.path || '');
                        ptPath = `${doResolve(val.npm)}/${val.path}`;
                    }

                    const ptConfig = path.join(ptPath, RENATIVE_CONFIG_PLUGINS_NAME);
                    c.paths.rnv.pluginTemplates.dirs[k] = ptPath;
                    if (fsExistsSync(ptConfig)) {
                        c.files.rnv.pluginTemplates.configs[k] = readObjectSync(ptConfig);
                        _parsePluginTemplateDependencies(
                            c,
                            c.files.rnv.pluginTemplates.configs[k].pluginTemplateDependencies,
                            k
                        );
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
        logInfo(
            `${chalk().white(dest.split('node_modules').pop())} overriden by: ${chalk().white(
                flavourSource.split('node_modules').pop()
            )}`
        );
        copyFolderContentsRecursiveSync(flavourSource, dest, false);
    } else if (fsExistsSync(source)) {
        logInfo(
            `${chalk().white(dest.split('node_modules').pop())} overriden by: ${chalk().white(
                source.split('node_modules').pop()
            )}`
        );
        copyFolderContentsRecursiveSync(source, dest, false);
        // fsReaddirSync(pp).forEach((dir) => {
        //     copyFileSync(path.resolve(pp, file), path.resolve(c.paths.project.dir, 'node_modules', dir));
        // });
    } else {
        logDebug(
            `Your plugin configuration has no override path ${chalk().white(source)}. skipping folder override action`
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
    const overrideConfig = overridePath ? readObjectSync(overridePath) : null;
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
    // console.log('SKSLSL', dir, dest);
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
                        `${chalk().white(dest.split('node_modules').pop())} overriden by: ${chalk().white(
                            overridePath.split('node_modules').pop()
                        )}`
                    );
                }
            } else {
                foundRegEx = true;
                fileToFix = fileToFix.replace(regEx, override[fk]);
                logSuccess(
                    `${chalk().white(dest.split('node_modules').pop())} requires override by: ${chalk().white(
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
                        )} for expression: ${chalk().gray(term)}. source: ${chalk().white(
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

export const installPackageDependenciesAndPlugins = async (c: RnvContext) => {
    logTask('installPackageDependenciesAndPlugins');

    await installPackageDependencies(c);
    await overrideTemplatePlugins(c);
    await configureFonts(c);
    await checkForPluginDependencies(c);
};

const _getPluginConfiguration = (c: RnvContext, pluginName: string) => {
    let renativePluginPath;
    try {
        renativePluginPath = require.resolve(`${pluginName}/renative.plugin.json`, { paths: [c.paths.project.dir] });
    } catch {
        //
    }

    if (renativePluginPath) {
        return readObjectSync(renativePluginPath);
    }
    return null;
};

export const checkForPluginDependencies = async (c: RnvContext) => {
    const toAdd: Record<string, string> = {};
    if (!c.buildConfig.plugins) return;

    const bcPlugins = c.buildConfig.plugins;

    Object.keys(c.buildConfig.plugins).forEach((pluginName) => {
        const renativePluginConfig = _getPluginConfiguration(c, pluginName);

        if (renativePluginConfig) {
            c._renativePluginCache[pluginName] = renativePluginConfig;
        }

        if (renativePluginConfig?.plugins) {
            // we have dependencies for this plugin
            Object.keys(renativePluginConfig.plugins).forEach((p) => {
                const plg = bcPlugins[pluginName];
                if (!bcPlugins[p] && typeof plg !== 'string' && plg.plugins?.[p] !== null) {
                    logWarning(`Plugin ${p} is not installed yet.`);
                    toAdd[p] = renativePluginConfig.plugins[p];
                    bcPlugins[p] = renativePluginConfig.plugins[p];
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
                warningMessage: `One or more dependencies are not installed: ${chalk().white(
                    Object.keys(toAdd).join(', ')
                )}`,
            });
            install = answer.confirm;
        } else {
            logWarning('CI detected. Automatically installing dependencies');
            install = true;
        }

        if (install) {
            c.files.project.config_original.plugins = {
                ...c.files.project.config_original.plugins,
                ...toAdd,
            };
            writeRenativeConfigFile(c, c.paths.project.config, c.files.project.config_original);
            // Need to reload merged files
            await parseRenativeConfigs(c);
            await configurePlugins(c);
            await installPackageDependenciesAndPlugins(c);
        }
    }
};

// const getPluginPlatformFromString = (p: string): RnvPluginPlatform => p as RnvPluginPlatform;

export const overrideTemplatePlugins = async (c: RnvContext) => {
    logTask('overrideTemplatePlugins');

    const rnvPluginsDirs = c.paths.rnv.pluginTemplates.dirs;
    const appPluginDirs = c.paths.appConfig.pluginDirs;

    parsePlugins(
        c,
        c.platform,
        (plugin, pluginPlat, key) => {
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
                    `Plugin overrides disabled for: ${chalk().white(key)} with disablePluginTemplateOverrides. SKIPPING`
                );
            }
        },
        true
    );
    return true;
};

export const copyTemplatePluginsSync = (c: RnvContext) => {
    const { platform } = c;
    const destPath = path.join(getAppFolder(c));

    logTask('copyTemplatePluginsSync', `(${destPath})`);

    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        const objectInject = [...c.configPropsInjects];
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
        //     const sourcePathRnvPlugin = getBuildsFolder(c, platform, path.join(c.paths.rnv.pluginTemplates.dir, key));
        //     copyFolderContentsRecursiveSync(sourcePathRnvPlugin, destPath, true, undefined, false, objectInject);
        // }

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        const sourcePath3 = getBuildsFolder(
            c,
            platform,
            path.join(c.paths.project.appConfigBase.dir, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath3, destPath, true, undefined, false, objectInject);

        // FOLDER MERGERS FROM PROJECT CONFIG (PRIVATE)
        const sourcePath3secLegacy = getBuildsFolder(
            c,
            platform,
            path.join(c.paths.workspace.project.appConfigBase.dir_LEGACY, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath3secLegacy, destPath, true, undefined, false, objectInject);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN (PRIVATE)
        const sourcePath3sec = getBuildsFolder(
            c,
            platform,
            path.join(c.paths.workspace.project.appConfigBase.dir, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath3sec, destPath, true, undefined, false, objectInject);

        if (sourcePath3secLegacy && fsExistsSync(sourcePath3secLegacy)) {
            logWarning(`Path: ${chalk().red(sourcePath3secLegacy)} is DEPRECATED.
    Move your files to: ${chalk().white(sourcePath3sec)} instead`);
        }

        // FOLDER MERGES FROM APP CONFIG PLUGIN
        const sourcePath2 = getBuildsFolder(c, platform, path.join(c.paths.appConfig.dir, `plugins/${key}`));
        copyFolderContentsRecursiveSync(sourcePath2, destPath, true, undefined, false, objectInject);

        // FOLDER MERGES FROM APP CONFIG PLUGIN (PRIVATE)
        const sourcePath2sec = getBuildsFolder(
            c,
            platform,
            path.join(c.paths.workspace.appConfig.dir, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath2sec, destPath, true, undefined, false, objectInject);

        // FOLDER MERGES FROM SCOPED PLUGIN TEMPLATES
        Object.keys(c.paths.rnv.pluginTemplates.dirs).forEach((pathKey) => {
            if (pathKey !== 'rnv') {
                const pluginTemplatePath = c.paths.rnv.pluginTemplates.dirs[pathKey];

                const sourcePath4sec = getBuildsFolder(c, platform, path.join(pluginTemplatePath, key));
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

export const getModuleConfigs = (c: RnvContext, primaryKey?: RnvPluginWebpackKey): RnvModuleConfig => {
    let modulePaths: Array<string> = [];
    const moduleAliases: Record<string, string | undefined> = {};

    const doNotResolveModulePaths: Array<string> = [];

    // PLUGINS
    parsePlugins(
        c,
        c.platform,
        (plugin, pluginPlat, key) => {
            let webpackConfig: RenativeWebpackConfig | undefined;

            if (primaryKey && plugin[primaryKey]) {
                webpackConfig = plugin[primaryKey];
            } else {
                webpackConfig = plugin.webpack || plugin.webpackConfig;
            }

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
        },
        true
    );

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
