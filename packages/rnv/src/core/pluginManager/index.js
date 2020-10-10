/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
import path from 'path';
import merge from 'deepmerge';
import {
    mergeObjects,
    sanitizeDynamicProps,
    readObjectSync,
    copyFolderContentsRecursiveSync,
    fsWriteFileSync,
    fsExistsSync,
    fsLstatSync,
    fsReadFileSync
} from '../systemManager/fileutils';
import { installPackageDependencies } from '../systemManager/npmUtils';
import { getConfigProp, getBuildsFolder, getAppFolder } from '../common';
import { versionCheck, writeRenativeConfigFile } from '../configManager/configParser';

import { SUPPORTED_PLATFORMS, INJECTABLE_CONFIG_PROPS, RENATIVE_CONFIG_PLUGINS_NAME } from '../constants';
import {
    chalk,
    logSuccess,
    logTask,
    logWarning,
    logError,
    logDebug,
    logInfo
} from '../systemManager/logger';
import { doResolve } from '../resolve';
import { inquirerPrompt } from '../../cli/prompt';

export const getPluginList = (c, isUpdate = false) => {
    const output = {
        asString: '',
        asArray: [],
        plugins: [],
        allPlugins: {} // this is used by taskRnvPluginAdd
    };

    let i = 1;

    Object.keys(c.files.rnv.pluginTemplates.configs).forEach((pk) => {
        const plugins = c.files.rnv.pluginTemplates.configs[pk].pluginTemplates;
        Object.keys(plugins).forEach((k) => {
            const p = plugins[k];

            let platforms = '';
            SUPPORTED_PLATFORMS.forEach((v) => {
                if (p[v]) platforms += `${v}, `;
            });
            if (platforms.length) {
                platforms = platforms.slice(0, platforms.length - 2);
            }
            const installedPlugin = c.buildConfig
                && c.buildConfig.plugins
                && c.buildConfig.plugins[k];
            const installedString = installedPlugin
                ? chalk().yellow('installed')
                : chalk().green('not installed');
            if (isUpdate && installedPlugin) {
                output.plugins.push(k);
                let versionString;
                if (installedPlugin.version !== p.version) {
                    versionString = `(${chalk().yellow(
                        installedPlugin.version
                    )}) => (${chalk().green(p.version)})`;
                } else {
                    versionString = `(${chalk().green(installedPlugin.version)})`;
                }
                output.asString += ` [${i}]> ${chalk().bold(
                    k
                )} ${versionString}\n`;
                output.asArray.push({
                    name: `${k} ${versionString}`,
                    value: k
                });
                output.allPlugins[k] = p; // this is used by taskRnvPluginAdd
                i++;
            } else if (!isUpdate) {
                output.plugins.push(k);
                output.asString += ` [${i}]> ${chalk().bold(k)} (${chalk().grey(
                    p.version
                )}) [${platforms}] - ${installedString}\n`;
                output.asArray.push({
                    name: `${k} (${chalk().grey(
                        p.version
                    )}) [${platforms}] - ${installedString}`,
                    value: k
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


const _getPluginScope = (plugin) => {
    if (typeof plugin === 'string' || plugin instanceof String) {
        if (plugin.startsWith('source:')) {
            return { scope: plugin.split(':').pop() };
        }
        return { npmVersion: plugin };
    } if (plugin?.source) {
        return { scope: plugin?.source };
    }
    return { scope: 'rnv' };
};

export const getMergedPlugin = (c, key) => {
    logDebug(`getMergedPlugin:${key}`);

    const plugin = c.buildConfig.plugins?.[key];
    if (!plugin) return null;

    const scopes = [];
    const mergedPlugin = _getMergedPlugin(c, plugin, key, null, scopes);
    scopes.reverse();
    // if (!mergedPlugin.version) {
    //     logWarning(`Plugin ${key} has no version`);
    //     // return null;
    // }
    mergedPlugin._scopes = scopes;
    mergedPlugin._id = key;
    return mergedPlugin;
};

const _getMergedPlugin = (c, plugin, pluginKey, parentScope, scopes, skipSanitize) => {
    if (!plugin) {
        return {};
    }

    const { scope, npmVersion } = _getPluginScope(plugin);
    if (scope === parentScope) return plugin;

    if (npmVersion) {
        return {
            version: npmVersion
        };
    }
    if (scope !== '' && !!scope && !c.buildConfig.pluginTemplates?.[scope]) {
        logWarning(
            `Plugin ${pluginKey} is not recognized plugin in ${scope} scope`
        );
    } else if (scope) {
        scopes.push(scope);
    }

    const parentPlugin = _getMergedPlugin(c,
      c.buildConfig.pluginTemplates?.[scope]?.[pluginKey], pluginKey, scope, scopes, true);
    let currentPlugin = plugin;
    if (typeof plugin === 'string' || plugin instanceof String) {
        currentPlugin = {};
    }
    const configPropsInjects = {};
    INJECTABLE_CONFIG_PROPS.forEach((v) => {
        configPropsInjects[v] = getConfigProp(c, c.platform, v);
    });
    if (currentPlugin.pluginDependencies) {
        Object.keys(currentPlugin.pluginDependencies).forEach((plugDepKey) => {
            if (currentPlugin.pluginDependencies[plugDepKey] === 'source:self') {
                currentPlugin.pluginDependencies[plugDepKey] = `source:${parentScope}`;
            }
        });
    }
    const mergedObj = mergeObjects(c, parentPlugin, currentPlugin, true, true);
    // IMPORTANT: only final top level merge should be sanitized
    const obj = skipSanitize ? mergedObj : sanitizeDynamicProps(mergedObj, c.buildConfig?._refs);

    // IMPORTANT: only final top level merge should be sanitized
    const mergedPlugin = skipSanitize ? obj : sanitizeDynamicProps(obj, obj.props, configPropsInjects);

    return mergedPlugin;
};

export const configurePlugins = async (c) => {
    logTask('configurePlugins');

    if (!c.files.project.package.dependencies) {
        c.files.project.package.dependencies = {};
    }

    let hasPackageChanged = false;

    if (!c.buildConfig?.plugins) {
        return;
    }

    const newDeps = {};
    const newDevDeps = {};
    const { dependencies, devDependencies } = c.files.project.package;
    Object.keys(c.buildConfig.plugins).forEach((k) => {
        const plugin = getMergedPlugin(c, k);

        if (!plugin) {
            logWarning(
                `Plugin with name ${chalk().white(
                    k
                )} does not exists in ReNative source:rnv scope. you need to define it manually here: ${chalk().white(
                    c.paths.project.builds.config
                )}`
            );
        } else if (dependencies && dependencies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true
                    && dependencies[k] !== plugin.version) {
                if (k === 'renative' && c.runtime.isWrapper) {
                    logWarning(
                        "You're in ReNative wrapper mode. plugin renative will stay as local dep!"
                    );
                } else {
                    logWarning(
                        `Version mismatch of dependency ${chalk().white(
                            k
                        )} between:
${chalk().white(c.paths.project.package)}: v(${chalk().red(dependencies[k])}) and
${chalk().white(c.paths.project.builds.config)}: v(${chalk().green(
    plugin.version
)}).
package.json will be overriden`
                    );

                    hasPackageChanged = true;
                    newDeps[k] = plugin.version;
                }
            }
        } else if (devDependencies && devDependencies[k]) {
            if (
                plugin['no-active'] !== true
                    && plugin['no-npm'] !== true
                    && devDependencies[k] !== plugin.version
            ) {
                logWarning(
                    `Version mismatch of devDependency ${chalk().white(
                        k
                    )} between package.json: v(${chalk().red(
                        devDependencies[k]
                    )}) and plugins.json: v(${chalk().red(
                        plugin.version
                    )}). package.json will be overriden`
                );
                hasPackageChanged = true;
                newDevDeps[k] = plugin.version;
            }
        } else if (
            plugin['no-active'] !== true
                && plugin['no-npm'] !== true
        ) {
            // Dependency does not exists
            if (plugin.version) {
                logInfo(
                    `Missing dependency ${chalk().white(k)} v(${chalk().red(
                        plugin.version
                    )}) in package.json. INSTALLING...DONE`
                );

                hasPackageChanged = true;
                newDeps[k] = plugin.version;
            }
        }

        if (plugin && plugin.npm) {
            Object.keys(plugin.npm).forEach((npmKey) => {
                const npmDep = plugin.npm[npmKey];
                // IMPORTANT: Do not override top level override with plugin.npm ones
                const topLevelPlugin = getMergedPlugin(c, npmKey);
                if (topLevelPlugin && topLevelPlugin?.version !== npmDep) {
                    logInfo(`RNV Detected plugin dependency conflict. ${chalk().cyan('RESOLVING...')}
- ${npmKey}@${chalk().green(topLevelPlugin?.version)} ${chalk().cyan('<=')}
- ${k} .npm sub dependencies:
   |- ${npmKey}@${chalk().red(npmDep)}`);
                } else if (!dependencies[npmKey]) {
                    logInfo(
                        `Plugin ${chalk().white(
                            k
                        )} requires npm dependency ${chalk().white(
                            npmKey
                        )}. INSTALLING...DONE`
                    );
                    newDeps[npmKey] = npmDep;
                    hasPackageChanged = true;
                } else if (dependencies[npmKey] !== npmDep) {
                    logWarning(
                        `Plugin ${chalk().white(
                            k
                        )} npm dependency ${chalk().white(npmKey)} mismatch (${chalk().red(
                            dependencies[npmKey]
                        )}) => (${chalk().green(
                            npmDep
                        )}) .updating npm dependency in your package.json`
                    );
                    newDeps[npmKey] = npmDep;
                    hasPackageChanged = true;
                }
            });
        }
    });

    // logTask('configurePlugins', `shouldUpdate:${!!hasPackageChanged}:${!c.runtime.skipPackageUpdate}`);
    await versionCheck(c);

    if (hasPackageChanged && !c.runtime.skipPackageUpdate) {
        _updatePackage(c, { dependencies: newDeps, devDependencies: newDevDeps });
    }
    return true;
};

const _updatePackage = (c, override) => {
    const newPackage = merge(c.files.project.package, override);
    writeRenativeConfigFile(c, c.paths.project.package, newPackage);
    c.files.project.package = newPackage;
    c._requiresNpmInstall = true;
};

export const resolvePluginDependants = async (c) => {
    logTask('resolvePluginDependants');
    const { plugins } = c.buildConfig;

    if (plugins) {
        const pluginKeys = Object.keys(plugins);
        for (let i = 0; i < pluginKeys.length; i++) {
            const key = pluginKeys[i];
            await _resolvePluginDependencies(c, key, plugins[key], null);
        }
    }

    return true;
};

const _resolvePluginDependencies = async (c, key, keyScope, parentKey) => {
    // IMPORTANT: Do not cache this valuse as they need to be refreshed every
    // round in case new plugin has been installed and c.buildConfig generated
    const { pluginTemplates } = c.buildConfig;
    const plugin = getMergedPlugin(c, key);

    const { scope } = _getPluginScope(keyScope);

    if (!plugin) {
        const depPlugin = pluginTemplates[scope]?.[key];

        if (depPlugin) {
            // console.log('INSTALL PLUGIN???', key, depPlugin.source);
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                message: `Install ${key}?`,
                warningMessage: `Plugin ${chalk().white(key)} source:${
                    chalk().white(scope)} required by ${chalk().red(parentKey)} is not installed`
            });
            if (confirm) {
                c.files.project.config.plugins[key] = `source:${scope}`;
                writeRenativeConfigFile(c, c.paths.project.config, c.files.project.config);
                logSuccess(`Plugin ${key} sucessfully installed`);
                c._requiresNpmInstall = true;
            }
        } else {
            logWarning(`Plugin ${chalk().white(parentKey)} requires ${
                chalk().red(key)} which is not available in your system`);
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
            await _resolvePluginDependencies(c, depKey, depScope, key);
        }
    }
    return true;
};

export const parsePlugins = (c, platform, pluginCallback, ignorePlatformObjectCheck) => {
    logTask('parsePlugins');
    if (c.buildConfig) {
        const includedPlugins = getConfigProp(
            c,
            platform,
            'includedPlugins',
            []
        );
        const excludedPlugins = getConfigProp(
            c,
            platform,
            'excludedPlugins',
            []
        );
        if (includedPlugins) {
            const { plugins } = c.buildConfig;
            if (plugins) {
                Object.keys(plugins).forEach((key) => {
                    if (
                        (includedPlugins.includes('*')
                            || includedPlugins.includes(key))
                        && !excludedPlugins.includes(key)
                    ) {
                        const plugin = getMergedPlugin(c, key);
                        if (plugin) {
                            const pluginPlat = plugin[platform];
                            if (ignorePlatformObjectCheck) {
                                pluginCallback(plugin, pluginPlat, key);
                            } else if (pluginPlat) {
                                if (
                                    plugin['no-active'] !== true
                                    && plugin.enabled !== false
                                    && pluginPlat.enabled !== false
                                ) {
                                    if (plugin.deprecated) {
                                        logWarning(plugin.deprecated);
                                    }
                                    if (pluginCallback) {
                                        pluginCallback(plugin, pluginPlat, key);
                                    }
                                } else {
                                    logWarning(
                                        `Plugin ${key} is marked disabled. skipping.`
                                    );
                                }
                            }
                        }
                    }
                });
            } else {
                logError(
                    `You have no plugins defined in ${chalk().white(
                        c.paths.project.builds.config
                    )}`
                );
            }
        } else {
            logWarning(
                `You haven't included any ${chalk().white(
                    '{ common: { includedPlugins: [] }}'
                )} in your ${chalk().white(
                    c.paths.appConfig.config
                )}. Your app might not work correctly`
            );
        }
    }
};

export const loadPluginTemplates = async (c) => {
    logTask('loadPluginTemplates');
    c.files.rnv.pluginTemplates.config = readObjectSync(
        c.paths.rnv.pluginTemplates.config
    );

    c.files.rnv.pluginTemplates.configs = {
        rnv: c.files.rnv.pluginTemplates.config
    };

    c.paths.rnv.pluginTemplates.dirs = { rnv: c.paths.rnv.pluginTemplates.dir };

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

const _parsePluginTemplateDependencies = (c, customPluginTemplates, scope = 'root') => {
    logTask('_parsePluginTemplateDependencies', `scope:${scope}`);
    const missingDeps = [];
    if (customPluginTemplates) {
        Object.keys(customPluginTemplates).forEach((k) => {
            const val = customPluginTemplates[k];
            if (val.npm) {
                const npmDep = c.files.project.package?.dependencies[val.npm]
                  || c.files.project.package?.devDependencies[val.npm];

                if (npmDep) {
                    let ptPath;
                    if (npmDep.startsWith('file:')) {
                        ptPath = path.join(
                            c.paths.project.dir,
                            npmDep.replace('file:', ''),
                            val.path || ''
                        );
                    } else {
                        // ptPath = path.join(c.paths.project.nodeModulesDir, val.npm, val.path || '');
                        ptPath = `${doResolve(val.npm)}/${val.path}`;
                    }

                    const ptConfig = path.join(
                        ptPath,
                        RENATIVE_CONFIG_PLUGINS_NAME
                    );
                    c.paths.rnv.pluginTemplates.dirs[k] = ptPath;
                    if (fsExistsSync(ptConfig)) {
                        c.files.rnv.pluginTemplates.configs[k] = readObjectSync(
                            ptConfig
                        );
                        _parsePluginTemplateDependencies(c,
                            c.files.rnv.pluginTemplates.configs[k].pluginTemplateDependencies,
                            k);
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

const getCleanRegExString = str => str
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\^/g, '\\^')
    .replace(/\?/g, '\\?')
    .replace(/\|/g, '\\|')
    .replace(/\*/g, '\\*')
    .replace(/\|/g, '\\|')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\+/g, '\\+')
    .replace(/ /g, ' {1,}');

const _overridePlugin = (c, pluginsPath, dir) => {
    const source = path.resolve(pluginsPath, dir, 'overrides');
    const dest = doResolve(dir, false);
    if (!dest) return;

    const plugin = getMergedPlugin(c, dir);
    let flavourSource;
    if (plugin) {
        flavourSource = path.resolve(
            pluginsPath,
            dir,
            `overrides@${plugin.version}`
        );
    }

    if (flavourSource && fsExistsSync(flavourSource)) {
        copyFolderContentsRecursiveSync(flavourSource, dest, false);
    } else if (fsExistsSync(source)) {
        copyFolderContentsRecursiveSync(source, dest, false);
        // fsReaddirSync(pp).forEach((dir) => {
        //     copyFileSync(path.resolve(pp, file), path.resolve(c.paths.project.dir, 'node_modules', dir));
        // });
    } else {
        logDebug(
            `Your plugin configuration has no override path ${chalk().white(
                source
            )}. skipping folder override action`
        );
    }

    let overridePath = path.resolve(pluginsPath, dir, `overrides@${plugin.version}.json`);
    if (!fsExistsSync(overridePath)) {
        overridePath = path.resolve(pluginsPath, dir, 'overrides.json');
    }
    const overrideConfig = readObjectSync(overridePath);
    const overrides = overrideConfig?.overrides;
    if (overrides) {
        Object.keys(overrides).forEach((k) => {
            const ovDir = path.join(dest, k);
            const override = overrides[k];
            if (fsExistsSync(ovDir)) {
                if (fsLstatSync(ovDir).isDirectory()) {
                    logWarning(
                        'overrides.json: Directories not supported yet. specify path to actual file'
                    );
                } else {
                    overrideFileContents(ovDir, override, overridePath);
                }
            }
        });
    }
};

export const overrideFileContents = (dest, override, overridePath = '') => {
    let fileToFix = fsReadFileSync(dest).toString();
    let foundRegEx = false;
    const failTerms = [];
    Object.keys(override).forEach((fk) => {
        const regEx = new RegExp(`${getCleanRegExString(fk)}`, 'g');
        const count = (fileToFix.match(regEx) || []).length;

        const overrided = override[fk];
        const regEx2 = new RegExp(getCleanRegExString(overrided), 'g');
        const count2 = (fileToFix.match(regEx2) || []).length;
        if (!count) {
            if (!count2) {
                failTerms.push(fk);
            } else {
                foundRegEx = true;
            }
        } else {
            foundRegEx = true;
            fileToFix = fileToFix.replace(regEx, override[fk]);
        }
    });
    if (!foundRegEx) {
        failTerms.forEach((term) => {
            logWarning(`No Match found in ${chalk().red(
                dest
            )} for expression: ${chalk().red(term)}.
Consider update or removal of ${chalk().white(overridePath)}`);
        });
    }

    fsWriteFileSync(dest, fileToFix);
};

export const installPackageDependenciesAndPlugins = async (c) => {
    logTask('installPackageDependenciesAndPlugins');

    await installPackageDependencies(c);
    await overrideTemplatePlugins(c);
};


export const overrideTemplatePlugins = async (c) => {
    logTask('overrideTemplatePlugins');

    const rnvPluginsDirs = c.paths.rnv.pluginTemplates.dirs;
    const appPluginDirs = c.paths.appConfig.pluginDirs;
    const appBasePluginDir = c.paths.project.appConfigBase.pluginsDir;

    parsePlugins(c, c.platform, (plugin, pluginPlat, key) => {
        if (plugin?._scopes?.length) {
            plugin._scopes.forEach((pluginScope) => {
                const pluginOverridePath = rnvPluginsDirs[pluginScope];
                if (pluginOverridePath) {
                    _overridePlugin(c, pluginOverridePath, key);
                }
            });
        }

        if (appBasePluginDir) {
            _overridePlugin(c, appBasePluginDir, key);
        }
        if (appPluginDirs) {
            for (let k = 0; k < appPluginDirs.length; k++) {
                _overridePlugin(c, appPluginDirs[k], key);
            }
        }
    }, true);
    return true;
};

export const copyTemplatePluginsSync = (c) => {
    const { platform } = c;
    const destPath = path.join(getAppFolder(c));

    logTask('copyTemplatePluginsSync', `(${destPath})`);


    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        const objectInject = [...c.configPropsInjects];
        if (plugin.props) {
            Object.keys(plugin.props).forEach((v) => {
                objectInject.push({
                    pattern: `{{props.${v}}}`,
                    override: plugin.props[v]
                });
            });
        }
        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        const sourcePathRnvPlugin = getBuildsFolder(
            c,
            platform,
            path.join(c.paths.rnv.pluginTemplates.dir, key)
        );
        copyFolderContentsRecursiveSync(sourcePathRnvPlugin, destPath, true, false, false, objectInject);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN
        const sourcePath3 = getBuildsFolder(
            c,
            platform,
            path.join(c.paths.project.appConfigBase.dir, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath3, destPath, true, false, false, objectInject);

        // FOLDER MERGERS FROM PROJECT CONFIG (PRIVATE)
        const sourcePath3secLegacy = getBuildsFolder(
            c,
            platform,
            path.join(
                c.paths.workspace.project.appConfigBase.dir_LEGACY,
                `plugins/${key}`
            )
        );
        copyFolderContentsRecursiveSync(sourcePath3secLegacy, destPath, true, false, false, objectInject);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN (PRIVATE)
        const sourcePath3sec = getBuildsFolder(
            c,
            platform,
            path.join(
                c.paths.workspace.project.appConfigBase.dir,
                `plugins/${key}`
            )
        );
        copyFolderContentsRecursiveSync(sourcePath3sec, destPath, true, false, false, objectInject);

        if (fsExistsSync(sourcePath3secLegacy)) {
            logWarning(`Path: ${chalk().red(sourcePath3secLegacy)} is DEPRECATED.
    Move your files to: ${chalk().white(sourcePath3sec)} instead`);
        }

        // FOLDER MERGES FROM APP CONFIG PLUGIN
        const sourcePath2 = getBuildsFolder(
            c,
            platform,
            path.join(c.paths.appConfig.dir, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath2, destPath, true, false, false, objectInject);

        // FOLDER MERGES FROM APP CONFIG PLUGIN (PRIVATE)
        const sourcePath2sec = getBuildsFolder(
            c,
            platform,
            path.join(c.paths.workspace.appConfig.dir, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath2sec, destPath, true, false, false, objectInject);
    });
};

export const getLocalRenativePlugin = () => ({
    version: 'file:../packages/renative',
    webpack: {
        modulePaths: [],
        moduleAliases: {
            renative: {
                projectPath: 'packages/renative'
            }
        }
    }
});

export default { getMergedPlugin, parsePlugins, getLocalRenativePlugin };
