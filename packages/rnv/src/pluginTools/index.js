import chalk from 'chalk';
import { mergeObjects, writeObjectSync } from '../systemTools/fileutils';
import { logTask, logWarning, logError, getConfigProp } from '../common';
import { askQuestion, finishQuestion } from '../systemTools/prompt';
import { versionCheck } from '../configTools/configParser';

const getMergedPlugin = (c, key, plugins, noMerge = false) => {
    const plugin = plugins[key];
    const origPlugin = c.files.rnv.pluginTemplates.config.plugins[key];
    if (typeof plugin === 'string' || plugin instanceof String) {
        if (plugin === 'source:rnv') {
            return origPlugin;
        }
        // NOT RECOGNIZED
        logWarning(`Plugin ${key} is not recognized RNV plugin`);
        return null;
    }


    if (origPlugin) {
        const mergedPlugin = mergeObjects(c, origPlugin, plugin, true, true);
        return mergedPlugin;
    }

    return plugin;
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
            if (hasPackageChanged) {
                writeObjectSync(c.paths.project.package, c.files.project.package);
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
