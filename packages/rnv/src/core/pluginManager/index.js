/* eslint-disable import/no-cycle */
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import merge from 'deepmerge';
import {
    mergeObjects,
    writeFileSync,
    sanitizeDynamicProps,
    readObjectSync,
    copyFolderContentsRecursiveSync,
    fsWriteFileSync
} from '../systemManager/fileutils';
import { getConfigProp, getBuildsFolder, getAppFolder } from '../common';
import { versionCheck, writeRenativeConfigFile } from '../configManager/configParser';

import { SUPPORTED_PLATFORMS, INJECTABLE_CONFIG_PROPS, RENATIVE_CONFIG_PLUGINS_NAME } from '../constants';
import {
    chalk,
    logSuccess,
    logTask,
    logWarning,
    logError,
    logToSummary,
    logDebug
} from '../systemManager/logger';
import { doResolve } from '../resolve';
import { inquirerPrompt } from '../../cli/prompt';
import {
    configureNodeModules,
} from '../projectManager/projectParser';

export const rnvPluginList = c => new Promise((resolve) => {
    logTask('_runList');

    const o = _getPluginList(c);

    // console.log(o.asString);
    logToSummary(`Plugins:\n\n${o.asString}`);

    resolve();
});

const _getPluginList = (c, isUpdate = false) => {
    const output = {
        asString: '',
        asArray: [],
        plugins: [],
        allPlugins: {} // this is used by rnvPluginAdd
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
                output.allPlugins[k] = p; // this is used by rnvPluginAdd
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
                output.allPlugins[k] = p; // this is used by rnvPluginAdd

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

/* eslint-disable no-await-in-loop */
export const rnvPluginAdd = async (c) => {
    logTask('rnvPluginAdd');

    if (c.runtime.isWrapper) {
        return Promise.reject('Adding plugins in wrapper project is not supported.');
    }

    const selPluginKey = c.program.rawArgs[4];

    const o = _getPluginList(c);

    const selPlugin = selPluginKey && o.allPlugins[selPluginKey];
    const selectedPlugins = {};
    const installMessage = [];

    if (!selPlugin) {
        const { plugin } = await inquirer.prompt({
            name: 'plugin',
            type: 'rawlist',
            message: 'Select the plugins you want to add',
            choices: o.asArray,
            pageSize: 50
        });

        selectedPlugins[plugin] = o.allPlugins[plugin];
        installMessage.push(
            `${chalk().white(plugin)} v(${chalk().green(
                o.allPlugins[plugin].version
            )})`
        );
    } else {
        selectedPlugins[selPluginKey] = selPlugin;
        installMessage.push(
            `${chalk().white(selPluginKey)} v(${chalk().green(selPlugin.version)})`
        );
    }

    const questionPlugins = {};

    Object.keys(selectedPlugins).forEach((key) => {
        // c.buildConfig.plugins[key] = 'source:rnv';
        const plugin = selectedPlugins[key];
        if (plugin.props) questionPlugins[key] = plugin;

        c.files.project.config.plugins[key] = 'source:rnv';

        // c.buildConfig.plugins[key] = selectedPlugins[key];
    });

    const pluginKeys = Object.keys(questionPlugins);
    for (let i = 0; i < pluginKeys.length; i++) {
        const pluginKey = pluginKeys[i];
        const plugin = questionPlugins[pluginKey];
        const pluginProps = Object.keys(plugin.props);
        const finalProps = {};
        for (let i2 = 0; i2 < pluginProps.length; i2++) {
            const { propValue } = await inquirer.prompt({
                name: 'propValue',
                type: 'input',
                message: `${pluginKey}: Add value for ${
                    pluginProps[i2]
                } (You can do this later in ./renative.json file)`
            });
            finalProps[pluginProps[i2]] = propValue;
        }
        c.files.project.config.plugins[pluginKey] = {};
        c.files.project.config.plugins[pluginKey].props = finalProps;
    }

    const spinner = ora(`Installing: ${installMessage.join(', ')}`).start();

    writeRenativeConfigFile(c, c.paths.project.config, c.files.project.config);

    await resolvePluginDependants(c);

    spinner.succeed('All plugins installed!');
    logSuccess('Plugins installed successfully!');
};

export const rnvPluginUpdate = async (c) => {
    logTask('rnvPluginUpdate');

    const o = _getPluginList(c, true);

    // console.log(o.asString);

    const { confirm } = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Above installed plugins will be updated with RNV'
    });

    if (confirm) {
        const { plugins } = c.buildConfig;
        Object.keys(plugins).forEach((key) => {
            // c.buildConfig.plugins[key] = o.json[key];
            c.files.project.config.plugins[key] = o.json[key];
        });

        writeFileSync(c.paths.project.config, c.files.project.config);

        logSuccess('Plugins updated successfully!');
    }
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

const _getMergedPlugin = (c, plugin, pluginKey, parentScope, scopes) => {
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
      c.buildConfig.pluginTemplates?.[scope]?.[pluginKey], pluginKey, scope, scopes);
    let currentPlugin = plugin;
    if (typeof plugin === 'string' || plugin instanceof String) {
        currentPlugin = {};
    }
    const configPropsInject = {};
    INJECTABLE_CONFIG_PROPS.forEach((v) => {
        configPropsInject[v] = getConfigProp(c, c.platform, v);
    });
    if (currentPlugin.pluginDependencies) {
        Object.keys(currentPlugin.pluginDependencies).forEach((plugDepKey) => {
            if (currentPlugin.pluginDependencies[plugDepKey] === 'source:self') {
                currentPlugin.pluginDependencies[plugDepKey] = `source:${parentScope}`;
            }
        });
    }
    const obj = sanitizeDynamicProps(
        mergeObjects(c, parentPlugin, currentPlugin, true, true),
            c.buildConfig?._refs
    );
    const mergedPlugin = sanitizeDynamicProps(obj, obj.props, configPropsInject);
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
                logWarning(
                    `Missing dependency ${chalk().white(k)} v(${chalk().red(
                        plugin.version
                    )}) in package.json. package.json will be overriden`
                );

                hasPackageChanged = true;
                newDeps[k] = plugin.version;
            }
        }

        if (plugin && plugin.npm) {
            Object.keys(plugin.npm).forEach((npmKey) => {
                const npmDep = plugin.npm[npmKey];
                if (!dependencies[npmKey]) {
                    logWarning(
                        `Plugin ${chalk().white(
                            k
                        )} requires npm dependency ${chalk().white(
                            npmKey
                        )} .Adding missing npm dependency to you package.json`
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

    logTask('configurePlugins', `shouldUpdate:${!!hasPackageChanged}:${!c.runtime.skipPackageUpdate}`);
    await versionCheck(c);

    if (hasPackageChanged && !c.runtime.skipPackageUpdate) {
        let newPackage = merge(c.files.project.package, { dependencies: newDeps });
        newPackage = merge(newPackage, { devDependencies: newDevDeps });
        writeRenativeConfigFile(c, c.paths.project.package, newPackage);
        c.files.project.package = newPackage;
        c._requiresNpmInstall = true;
    }
    return true;
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

    if (c._requiresNpmInstall) {
        await configurePlugins(c);
        await configureNodeModules(c);
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

export const loadPluginTemplates = (c) => {
    logTask('loadPluginTemplates');
    c.files.rnv.pluginTemplates.config = readObjectSync(
        c.paths.rnv.pluginTemplates.config
    );

    c.files.rnv.pluginTemplates.configs = {
        rnv: c.files.rnv.pluginTemplates.config
    };

    c.paths.rnv.pluginTemplates.dirs = { rnv: c.paths.rnv.pluginTemplates.dir };

    const customPluginTemplates = c.files.project.config?.paths?.pluginTemplates;
    _parsePluginTemplateDependencies(c, customPluginTemplates);
};

const _parsePluginTemplateDependencies = (c, customPluginTemplates, scope = 'root') => {
    logTask('_parsePluginTemplateDependencies', `scope:${scope}`);
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
                    if (fs.existsSync(ptConfig)) {
                        c.files.rnv.pluginTemplates.configs[k] = readObjectSync(
                            ptConfig
                        );
                        _parsePluginTemplateDependencies(c,
                            c.files.rnv.pluginTemplates.configs[k].pluginTemplateDependencies,
                            k);
                    }
                }
            }
        });
    }
};

// const overridePlugins = async (c, pluginsPath) => {
//     logDebug(`overridePlugins:${pluginsPath}`, chalk().grey);
//
//     if (!fs.existsSync(pluginsPath)) {
//         logInfo(
//             `Your project plugin folder ${chalk().white(
//                 pluginsPath
//             )} does not exists. skipping plugin configuration`
//         );
//         return;
//     }
//
//     fs.readdirSync(pluginsPath).forEach((dir) => {
//         if (dir.startsWith('@')) {
//             const pluginsPathNested = path.join(pluginsPath, dir);
//             fs.readdirSync(pluginsPathNested).forEach((subDir) => {
//                 _overridePlugin(c, pluginsPath, `${dir}/${subDir}`);
//             });
//         } else {
//             _overridePlugin(c, pluginsPath, dir);
//         }
//     });
// };

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

    if (flavourSource && fs.existsSync(flavourSource)) {
        copyFolderContentsRecursiveSync(flavourSource, dest, false);
    } else if (fs.existsSync(source)) {
        copyFolderContentsRecursiveSync(source, dest, false);
        // fs.readdirSync(pp).forEach((dir) => {
        //     copyFileSync(path.resolve(pp, file), path.resolve(c.paths.project.dir, 'node_modules', dir));
        // });
    } else {
        logDebug(
            `Your plugin configuration has no override path ${chalk().white(
                source
            )}. skipping folder override action`
        );
    }

    const overridePath = path.resolve(pluginsPath, dir, 'overrides.json');
    const overrideConfig = readObjectSync(
        path.resolve(pluginsPath, dir, 'overrides.json')
    );
    if (overrideConfig?.overrides) {
        Object.keys(overrideConfig.overrides).forEach((k) => {
            const override = overrideConfig.overrides[k];
            const ovDir = path.join(dest, k);
            if (fs.existsSync(ovDir)) {
                if (fs.lstatSync(ovDir).isDirectory()) {
                    logWarning(
                        'overrides.json: Directories not supported yet. specify path to actual file'
                    );
                } else {
                    let fileToFix = fs.readFileSync(ovDir).toString();
                    Object.keys(override).forEach((fk) => {
                        const regEx = new RegExp(fk, 'g');
                        const count = (fileToFix.match(regEx) || []).length;
                        if (!count) {
                            logWarning(`No Match found in ${chalk().red(
                                ovDir
                            )} for expression: ${chalk().red(fk)}.
Consider update or removal of ${chalk().white(overridePath)}`);
                        } else {
                            fileToFix = fileToFix.replace(regEx, override[fk]);
                        }
                    });
                    fsWriteFileSync(ovDir, fileToFix);
                }
            }
        });
    }
};


export const overrideTemplatePlugins = async (c) => {
    logTask('overrideTemplatePlugins');

    const rnvPluginsDirs = c.paths.rnv.pluginTemplates.dirs;
    const appPluginDirs = c.paths.appConfig.pluginDirs;
    const appBasePluginDir = c.paths.project.projectConfig.pluginsDir;

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

export const copyTemplatePluginsSync = (c, platform) => {
    const destPath = path.join(getAppFolder(c, platform));

    logTask('copyTemplatePluginsSync', `(${destPath})`);


    parsePlugins(c, platform, (plugin, pluginPlat, key) => {
        const objectInject = [...c.runtime.configPropsInject];
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
            path.join(c.paths.project.projectConfig.dir, `plugins/${key}`)
        );
        copyFolderContentsRecursiveSync(sourcePath3, destPath, true, false, false, objectInject);

        // FOLDER MERGERS FROM PROJECT CONFIG (PRIVATE)
        const sourcePath3secLegacy = getBuildsFolder(
            c,
            platform,
            path.join(
                c.paths.workspace.project.projectConfig.dir_LEGACY,
                `plugins/${key}`
            )
        );
        copyFolderContentsRecursiveSync(sourcePath3secLegacy, destPath, true, false, false, objectInject);

        // FOLDER MERGES FROM PROJECT CONFIG PLUGIN (PRIVATE)
        const sourcePath3sec = getBuildsFolder(
            c,
            platform,
            path.join(
                c.paths.workspace.project.projectConfig.dir,
                `plugins/${key}`
            )
        );
        copyFolderContentsRecursiveSync(sourcePath3sec, destPath, true, false, false, objectInject);

        if (fs.existsSync(sourcePath3secLegacy)) {
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
