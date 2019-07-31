import chalk from 'chalk';
import { mergeObjects } from '../systemTools/fileutils';
import { logTask, logWarning, getConfigProp } from '../common';

const getMergedPlugin = (c, key, plugins, noMerge = false) => {
    const plugin = plugins[key];
    const origPlugin = c.files.pluginTemplatesConfig.plugins[key];
    if (typeof plugin === 'string' || plugin instanceof String) {
        if (plugin === 'source:rnv') {
            return origPlugin;
        }
        // NOT RECOGNIZED
        logWarning(`Plugin ${key} is not recognized RNV plugin`);
        return null;
    }


    if (origPlugin) {
        const mergedPlugin = mergeObjects(c, origPlugin, plugin);
        return mergedPlugin;
    }

    return plugin;
};

const parsePlugins = (c, platform, pluginCallback) => {
    logTask(`parsePlugins:${platform}`);

    if (c.files.appConfigFile && c.files.pluginConfig) {
        const includedPlugins = getConfigProp(c, platform, 'includedPlugins', []);
        const excludedPlugins = getConfigProp(c, platform, 'excludedPlugins', []);
        if (includedPlugins) {
            const { plugins } = c.files.pluginConfig;
            Object.keys(plugins).forEach((key) => {
                if ((includedPlugins.includes('*') || includedPlugins.includes(key)) && !excludedPlugins.includes(key)) {
                    const plugin = getMergedPlugin(c, key, plugins);
                    if (plugin) {
                        const pluginPlat = plugin[c.platform];
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
            logWarning(`You haven't included any ${chalk.white('{ common: { includedPlugins: [] }}')} in your ${chalk.white(c.paths.appConfigPath)}. Your app might not work correctly`);
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
