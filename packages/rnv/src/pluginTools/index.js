import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import {
    mergeObjects,
    writeFileSync,
    sanitizeDynamicProps,
    readObjectSync,
    copyFolderContentsRecursiveSync,
    fsWriteFileSync
} from '../systemTools/fileutils';
import { getConfigProp, getBuildsFolder, getAppFolder } from '../common';
import { versionCheck } from '../configTools/configParser';

import { SUPPORTED_PLATFORMS, INJECTABLE_CONFIG_PROPS, RENATIVE_CONFIG_PLUGINS_NAME } from '../constants';
import {
    logSuccess,
    logTask,
    logWarning,
    logError,
    logToSummary,
    logInfo,
    logDebug
} from '../systemTools/logger';
import { executePipe } from '../projectTools/buildHooks';
import { doResolve } from '../resolve';

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
                ? chalk.yellow('installed')
                : chalk.green('not installed');
            if (isUpdate && installedPlugin) {
                output.plugins.push(k);
                let versionString;
                if (installedPlugin.version !== p.version) {
                    versionString = `(${chalk.yellow(
                        installedPlugin.version
                    )}) => (${chalk.green(p.version)})`;
                } else {
                    versionString = `(${chalk.green(installedPlugin.version)})`;
                }
                output.asString += ` [${i}]> ${chalk.bold(
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
                output.asString += ` [${i}]> ${chalk.bold(k)} (${chalk.grey(
                    p.version
                )}) [${platforms}] - ${installedString}\n`;
                output.asArray.push({
                    name: `${k} (${chalk.grey(
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

export const rnvPluginAdd = async (c) => {
    logTask('rnvPluginAdd');

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
            `${chalk.white(plugin)} v(${chalk.green(
                o.allPlugins[plugin].version
            )})`
        );
    } else {
        selectedPlugins[selPluginKey] = selPlugin;
        installMessage.push(
            `${chalk.white(selPluginKey)} v(${chalk.green(selPlugin.version)})`
        );
    }

    const questionPlugins = {};

    Object.keys(selectedPlugins).forEach((key) => {
        // c.buildConfig.plugins[key] = 'source:rnv';
        const plugin = selectedPlugins[key];
        if (plugin.props) questionPlugins[key] = plugin;

        c.files.project.config.plugins[key] = 'source:rnv';

        // c.buildConfig.plugins[key] = selectedPlugins[key];
        _checkAndAddDependantPlugins(c, selectedPlugins[key]);
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
                message: `${pluginKey}: Add value for ${pluginProps[i2]} (You can do this later in ./renative.json file)`
            });
            finalProps[pluginProps[i2]] = propValue;
        }
        c.files.project.config.plugins[pluginKey] = {};
        c.files.project.config.plugins[pluginKey].props = finalProps;
    }

    const spinner = ora(`Installing: ${installMessage.join(', ')}`).start();

    writeFileSync(c.paths.project.config, c.files.project.config);
    spinner.succeed('All plugins installed!');
    logSuccess('Plugins installed successfully!');
};

const _checkAndAddDependantPlugins = (c, plugin) => {
    logTask('_checkAndAddDependantPlugins');
    if (plugin.dependsOn) {
        plugin.dependsOn.forEach((v) => {
            Object.keys(c.files.rnv.pluginTemplates.configs).forEach((p) => {
                const templatePlugins = c.files.rnv.pluginTemplates.configs[p].pluginTemplates;
                if (templatePlugins[v]) {
                    logDebug(`Added dependant plugin ${v}`);
                    c.buildConfig.plugins[v] = templatePlugins[v];
                }
            });
        });
    }
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

const getMergedPlugin = (c, key, plugins, noMerge = false) => {
    const plugin = plugins[key];

    // const origPlugin = c.files.rnv.pluginTemplates.config.pluginTemplates[key];
    const rnvPlugin = c.files.rnv.pluginTemplates.configs?.rnv?.pluginTemplates?.[key];
    if (rnvPlugin) rnvPlugin.source = 'rnv';

    let origPlugin;
    if (typeof plugin === 'string' || plugin instanceof String) {
        if (plugin.startsWith('source:')) {
            const scope = plugin.split(':').pop();

            origPlugin = c.files.rnv.pluginTemplates.configs[scope]?.pluginTemplates?.[key];

            if (origPlugin) {
                origPlugin.source = scope;
                if (rnvPlugin && !origPlugin?.skipMerge) {
                    origPlugin = _getMergedPlugin(
                        c,
                        rnvPlugin,
                        origPlugin,
                        true,
                        true
                    );
                }
                return origPlugin;
            }
            logWarning(
                `Plugin ${key} is not recognized plugin in ${plugin} scope`
            );
            return null;
        }
        return {
            version: plugin,
            source: 'rnv'
        };
    }

    if (plugin) {
        if (plugin.source) {
            origPlugin = c.files.rnv.pluginTemplates.configs[plugin.source]?.pluginTemplates?.[key];
            if (rnvPlugin && !origPlugin?.skipMerge) {
                origPlugin = _getMergedPlugin(
                    c,
                    rnvPlugin,
                    origPlugin,
                    true,
                    true
                );
            }
        } else {
            origPlugin = rnvPlugin;
        }
    }

    if (origPlugin) {
        const mergedPlugin = _getMergedPlugin(
            c,
            origPlugin,
            plugin,
            true,
            true
        );
        return mergedPlugin;
    }

    return plugin;
};

const _getMergedPlugin = (c, obj1, obj2) => {
    const configPropsInject = {};
    INJECTABLE_CONFIG_PROPS.forEach((v) => {
        configPropsInject[v] = getConfigProp(c, c.platform, v);
    });
    const obj = sanitizeDynamicProps(
        mergeObjects(c, obj1, obj2, true, true),
        c.buildConfig?._refs
    );
    const plugin = sanitizeDynamicProps(obj, obj.props, configPropsInject);
    return plugin;
};

export const configurePlugins = c => new Promise((resolve, reject) => {
    logTask('configurePlugins');

    if (!c.files.project.package.dependencies) {
        c.files.project.package.dependencies = {};
    }

    let hasPackageChanged = false;

    Object.keys(c.buildConfig.plugins).forEach((k) => {
        const { dependencies } = c.files.project.package;
        const { devDependencies } = c.files.project.package;
        const plugin = getMergedPlugin(c, k, c.buildConfig.plugins);

        if (!plugin) {
            logWarning(
                `Plugin with name ${chalk.white(
                    k
                )} does not exists in ReNative source:rnv scope. you need to define it manually here: ${chalk.white(
                    c.paths.project.builds.config
                )}`
            );
        } else if (dependencies && dependencies[k]) {
            if (
                plugin['no-active'] !== true
                    && plugin['no-npm'] !== true
                    && dependencies[k] !== plugin.version
            ) {
                if (k === 'renative' && c.runtime.isWrapper) {
                    logWarning(
                        "You're in ReNative wrapper mode. plugin renative will stay as local dep!"
                    );
                } else {
                    logWarning(
                        `Version mismatch of dependency ${chalk.white(
                            k
                        )} between:
${chalk.white(c.paths.project.package)}: v(${chalk.red(dependencies[k])}) and
${chalk.white(c.paths.project.builds.config)}: v(${chalk.green(
    plugin.version
)}).
package.json will be overriden`
                    );

                    hasPackageChanged = true;
                    dependencies[k] = plugin.version;
                }
            }
        } else if (devDependencies && devDependencies[k]) {
            if (
                plugin['no-active'] !== true
                    && plugin['no-npm'] !== true
                    && devDependencies[k] !== plugin.version
            ) {
                logWarning(
                    `Version mismatch of devDependency ${chalk.white(
                        k
                    )} between package.json: v(${chalk.red(
                        devDependencies[k]
                    )}) and plugins.json: v(${chalk.red(
                        plugin.version
                    )}). package.json will be overriden`
                );
                hasPackageChanged = true;
                devDependencies[k] = plugin.version;
            }
        } else if (
            plugin['no-active'] !== true
                && plugin['no-npm'] !== true
        ) {
            // Dependency does not exists
            if (plugin.version) {
                logWarning(
                    `Missing dependency ${chalk.white(k)} v(${chalk.red(
                        plugin.version
                    )}) in package.json. package.json will be overriden`
                );

                hasPackageChanged = true;
                dependencies[k] = plugin.version;
            }
        }

        if (plugin && plugin.npm) {
            Object.keys(plugin.npm).forEach((npmKey) => {
                const npmDep = plugin.npm[npmKey];
                if (!dependencies[npmKey]) {
                    logWarning(
                        `Plugin ${chalk.white(
                            k
                        )} requires npm dependency ${chalk.white(
                            npmKey
                        )} .Adding missing npm dependency to you package.json`
                    );
                    dependencies[npmKey] = npmDep;
                    hasPackageChanged = true;
                } else if (dependencies[npmKey] !== npmDep) {
                    logWarning(
                        `Plugin ${chalk.white(
                            k
                        )} dependency mismatch (${chalk.red(
                            dependencies[npmKey]
                        )}) => (${chalk.green(
                            npmDep
                        )}) .updating npm dependency in your package.json`
                    );
                    dependencies[npmKey] = npmDep;
                    hasPackageChanged = true;
                }
            });
        }
    });

    logTask(`configurePlugins:${hasPackageChanged}`, chalk.grey);
    versionCheck(c)
        .then(() => {
            if (hasPackageChanged && !c.runtime.skipPackageUpdate) {
                writeFileSync(
                    c.paths.project.package,
                    c.files.project.package
                );
                c._requiresNpmInstall = true;
            }
            resolve();
        })
        .catch(e => reject(e));
});

const parsePlugins = (c, platform, pluginCallback, ignorePlatformObjectCheck) => {
    logTask(`parsePlugins:${platform}`);
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
                        const plugin = getMergedPlugin(c, key, plugins);
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
                    `You have no plugins defined in ${chalk.white(
                        c.paths.project.builds.config
                    )}`
                );
            }
        } else {
            logWarning(
                `You haven't included any ${chalk.white(
                    '{ common: { includedPlugins: [] }}'
                )} in your ${chalk.white(
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
                    }
                }
            }
        });
    }
};

// const overridePlugins = async (c, pluginsPath) => {
//     logDebug(`overridePlugins:${pluginsPath}`, chalk.grey);
//
//     if (!fs.existsSync(pluginsPath)) {
//         logInfo(
//             `Your project plugin folder ${chalk.white(
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

    const plugin = getMergedPlugin(c, dir, c.buildConfig.plugins);
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
            `Your plugin configuration has no override path ${chalk.white(
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
                            logWarning(`No Match found in ${chalk.red(
                                ovDir
                            )} for expression: ${chalk.red(fk)}.
Consider update or removal of ${chalk.white(overridePath)}`);
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
        const pluginOverridePath = rnvPluginsDirs[plugin.source];
        if (pluginOverridePath) {
            _overridePlugin(c, pluginOverridePath, key);
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
    logTask(`copyTemplatePluginsSync:${platform}`);

    const destPath = path.join(getAppFolder(c, platform));
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

const getLocalRenativePlugin = () => ({
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

export { getMergedPlugin, parsePlugins, getLocalRenativePlugin };

export default { getMergedPlugin, parsePlugins, getLocalRenativePlugin };
