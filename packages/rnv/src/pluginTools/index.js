import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { mergeObjects, writeFileSync, sanitizeDynamicProps } from '../systemTools/fileutils';
import { getConfigProp } from '../common';
import { versionCheck } from '../configTools/configParser';

import { SUPPORTED_PLATFORMS } from '../constants';
import {
    logSuccess,
    logTask, logWarning, logError, logToSummary
} from '../systemTools/logger';
import { executePipe } from '../projectTools/buildHooks';

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
            if (platforms.length) platforms = platforms.slice(0, platforms.length - 2);
            const installedPlugin = c.buildConfig && c.buildConfig.plugins && c.buildConfig.plugins[k];
            const installedString = installedPlugin ? chalk.yellow('installed') : chalk.green('not installed');
            if (isUpdate && installedPlugin) {
                output.plugins.push(k);
                let versionString;
                if (installedPlugin.version !== p.version) {
                    versionString = `(${chalk.yellow(installedPlugin.version)}) => (${chalk.green(p.version)})`;
                } else {
                    versionString = `(${chalk.green(installedPlugin.version)})`;
                }
                output.asString += ` [${i}]> ${chalk.bold(k)} ${versionString}\n`;
                output.asArray.push({ name: `${k} ${versionString}`, value: k });
                output.allPlugins[k] = p; // this is used by rnvPluginAdd
                i++;
            } else if (!isUpdate) {
                output.plugins.push(k);
                output.asString += ` [${i}]> ${chalk.bold(k)} (${chalk.grey(p.version)}) [${platforms}] - ${installedString}\n`;
                output.asArray.push({ name: `${k} (${chalk.grey(p.version)}) [${platforms}] - ${installedString}`, value: k });
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

    const o = _getPluginList(c);

    const { plugin } = await inquirer.prompt({
        name: 'plugin',
        type: 'rawlist',
        message: 'Select the plugins you want to add',
        choices: o.asArray,
        pageSize: 50
    });

    const installMessage = [];
    const selectedPlugins = {};
    selectedPlugins[plugin] = o.allPlugins[plugin];
    installMessage.push(`${chalk.white(plugin)} v(${chalk.green(o.allPlugins[plugin].version)})`);

    const questionPlugins = {}

    Object.keys(selectedPlugins).forEach((key) => {
        // c.buildConfig.plugins[key] = 'source:rnv';
        const plugin = selectedPlugins[key]
        if(plugin.props) questionPlugins[key] = plugin;
        c.files.project.config.plugins[key] = 'source:rnv';

        // c.buildConfig.plugins[key] = selectedPlugins[key];
        _checkAndAddDependantPlugins(c, selectedPlugins[key]);
    });

    const pluginKeys = Object.keys(questionPlugins)
    for(let i = 0; i < pluginKeys.length; i++) {
        const pluginKey = pluginKeys[i]
        const plugin = questionPlugins[pluginKey];
        const pluginProps = Object.keys(plugin.props);
        const finalProps = {}
        for(let i2 = 0; i2 < pluginProps.length; i2 ++) {
            const { propValue } = await inquirer.prompt({
                name: 'propValue',
                type: 'input',
                message: `${pluginKey}: Add value for ${pluginProps[i2]} (You can do this later in ./renative.json file)`
            });
            finalProps[pluginProps[i2]] = propValue
        }
        c.files.project.config.plugins[pluginKey] = {}
        c.files.project.config.plugins[pluginKey].props = finalProps
    }

    const spinner = ora(`Installing: ${installMessage.join(', ')}`).start();

    writeFileSync(c.paths.project.config, c.files.project.config);
    spinner.succeed('All plugins installed!');
    logSuccess('Plugins installed successfully!');
};

const _checkAndAddDependantPlugins = (c, plugin) => {
    if (plugin.dependsOn) {
        plugin.dependsOn.forEach((v) => {
            Object.keys(c.files.rnv.pluginTemplates.configs).forEach((p) => {
                const templatePlugins = c.files.rnv.pluginTemplates.configs[p].pluginTemplates;
                if (templatePlugins[v]) {
                    console.log(`Added dependant plugin ${v}`);
                    c.buildConfig.plugins[v] = templatePlugins[v];
                }
            });
        });
    }
};

export const rnvPluginUpdate = async (c) => {
    logTask('rnvPluginUpdate');

    const o = _getPluginList(c, true);

    console.log(o.asString);

    const { confirm } = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message: 'Above installed plugins will be updated with RNV',
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

    let origPlugin;
    if (typeof plugin === 'string' || plugin instanceof String) {
        const scope = plugin.split(':').pop();

        origPlugin = c.files.rnv.pluginTemplates.configs[scope]?.pluginTemplates?.[key];

        if (origPlugin) {
            if (rnvPlugin && !origPlugin?.skipMerge) {
                origPlugin = _getMergedPlugin(c, rnvPlugin, origPlugin, true, true);
            }
            return origPlugin;
        }
        logWarning(`Plugin ${key} is not recognized plugin in ${plugin} scope`);
        return null;
    }

    if (plugin) {
        if (plugin.source) {
            origPlugin = c.files.rnv.pluginTemplates.configs[plugin.source]?.pluginTemplates?.[key];
            if (rnvPlugin && !origPlugin?.skipMerge) {
                origPlugin = _getMergedPlugin(c, rnvPlugin, origPlugin, true, true);
            }
        } else {
            origPlugin = rnvPlugin;
        }
    }


    if (origPlugin) {
        const mergedPlugin = _getMergedPlugin(c, origPlugin, plugin, true, true);
        return mergedPlugin;
    }

    return plugin;
};

const _getMergedPlugin = (c, obj1, obj2) => {
    const obj = sanitizeDynamicProps(mergeObjects(c, obj1, obj2, true, true), c.buildConfig?._refs);
    return sanitizeDynamicProps(obj, obj.props);
};


export const configurePlugins = c => new Promise((resolve, reject) => {
    logTask('configurePlugins');

    if (!c.files.project.package.dependencies) {
        c.files.project.package.dependencies = {};
    }

    let hasPackageChanged = false;

    for (const k in c.buildConfig.plugins) {
        const { dependencies } = c.files.project.package;
        const { devDependencies } = c.files.project.package;
        const plugin = getMergedPlugin(c, k, c.buildConfig.plugins);

        if (!plugin) {
            logWarning(`Plugin with name ${
                chalk.white(k)} does not exists in ReNative source:rnv scope. you need to define it manually here: ${
                chalk.white(c.paths.project.builds.config)}`);
        } else if (dependencies && dependencies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true && dependencies[k] !== plugin.version) {
                if (k === 'renative' && c.runtime.isWrapper) {
                    logWarning('You\'re in ReNative wrapper mode. plugin renative will stay as local dep!');
                } else {
                    logWarning(
                        `Version mismatch of dependency ${chalk.white(k)} between:
  ${chalk.white(c.paths.project.package)}: v(${chalk.red(dependencies[k])}) and
  ${chalk.white(c.paths.project.builds.config)}: v(${chalk.green(plugin.version)}).
  package.json will be overriden`
                    );

                    hasPackageChanged = true;
                    dependencies[k] = plugin.version;
                }
            }
        } else if (devDependencies && devDependencies[k]) {
            if (plugin['no-active'] !== true && plugin['no-npm'] !== true && devDependencies[k] !== plugin.version) {
                logWarning(
                    `Version mismatch of devDependency ${chalk.white(k)} between package.json: v(${chalk.red(
                        devDependencies[k],
                    )}) and plugins.json: v(${chalk.red(plugin.version)}). package.json will be overriden`,
                );
                hasPackageChanged = true;
                devDependencies[k] = plugin.version;
            }
        } else if (plugin['no-active'] !== true && plugin['no-npm'] !== true) {
            // Dependency does not exists
            logWarning(
                `Missing dependency ${chalk.white(k)} v(${chalk.red(
                    plugin.version,
                )}) in package.json. package.json will be overriden`,
            );

            hasPackageChanged = true;
            dependencies[k] = plugin.version;
        }

        if (plugin && plugin.npm) {
            for (const npmKey in plugin.npm) {
                const npmDep = plugin.npm[npmKey];
                if (dependencies[npmKey] !== npmDep) {
                    logWarning(`Plugin ${chalk.white(k)} requires npm dependency ${chalk.white(npmKey)} .Adding missing npm dependency to you package.json`);
                    dependencies[npmKey] = npmDep;
                    hasPackageChanged = true;
                }
            }
        }
    }

    logTask(`configurePlugins:${hasPackageChanged}`, chalk.grey);
    versionCheck(c)
        .then(() => {
            if (hasPackageChanged && !c.runtime.skipPackageUpdate) {
                writeFileSync(c.paths.project.package, c.files.project.package);
                c._requiresNpmInstall = true;
            }
            resolve();
        }).catch(e => reject(e));
});

const parsePlugins = (c, platform, pluginCallback) => {
    logTask(`parsePlugins:${platform}`);
    if (c.buildConfig) {
        const includedPlugins = getConfigProp(c, platform, 'includedPlugins', []);
        const excludedPlugins = getConfigProp(c, platform, 'excludedPlugins', []);
        if (includedPlugins) {
            const { plugins } = c.buildConfig;
            if (plugins) {
                Object.keys(plugins).forEach((key) => {
                    if ((includedPlugins.includes('*') || includedPlugins.includes(key)) && !excludedPlugins.includes(key)) {
                        const plugin = getMergedPlugin(c, key, plugins);
                        if (plugin) {
                            const pluginPlat = plugin[platform];
                            if (pluginPlat) {
                                if (plugin['no-active'] !== true && plugin.enabled !== false && pluginPlat.enabled !== false) {
                                    if (plugin.deprecated) {
                                        logWarning(plugin.deprecated);
                                    }
                                    if (pluginCallback) pluginCallback(plugin, pluginPlat, key);
                                } else {
                                    logWarning(`Plugin ${key} is marked disabled. skipping.`);
                                }
                            }
                        }
                    }
                });
            } else {
                logError(`You have no plugins defined in ${chalk.white(c.paths.project.builds.config)}`);
            }
        } else {
            logWarning(`You haven't included any ${chalk.white('{ common: { includedPlugins: [] }}')} in your ${chalk.white(c.paths.appConfig.config)}. Your app might not work correctly`);
        }
    }
};

const getLocalRenativePlugin = () => ({
    version: 'file:./packages/renative',
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
