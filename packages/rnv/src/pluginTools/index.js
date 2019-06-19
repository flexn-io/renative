import { mergeObjects } from '../systemTools/fileutils';
import { logTask, logWarning } from '../common';

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
        const mergedPlugin = mergeObjects(origPlugin, plugin);
        return mergedPlugin;
    }

    return plugin;
};

const parsePlugins = (c, pluginCallback) => {
    logTask('parsePlugins');

    if (c.files.appConfigFile && c.files.pluginConfig) {
        const { includedPlugins } = c.files.appConfigFile.common;
        if (includedPlugins) {
            const { plugins } = c.files.pluginConfig;
            Object.keys(plugins).forEach((key) => {
                if (includedPlugins.includes('*') || includedPlugins.includes(key)) {
                    const plugin = getMergedPlugin(c, key, plugins);
                    if (plugin) {
                        const pluginPlat = plugin[c.platform];
                        if (pluginPlat) {
                            if (plugin['no-active'] !== true) {
                                if (pluginCallback) pluginCallback(plugin, pluginPlat, key);
                            }
                        }
                    }
                }
            });
        }
    }
};

export { getMergedPlugin, parsePlugins };
