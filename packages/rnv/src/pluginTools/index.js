import merge from 'deepmerge';

const getMergedPlugin = (c, key, plugins, noMerge = false) => {
    const plugin = plugins[key];
    const origPlugin = c.files.pluginTemplatesConfig.plugins[key];
    if (typeof plugin === 'string' || plugin instanceof String) {
        if (plugin === 'source:rnv') {
            return origPlugin;
        }
        // NOT RECOGNIZED
        return null;
    }

    if (origPlugin) {
        return merge(origPlugin, plugin);
    }

    return plugin;
};

export { getMergedPlugin };
