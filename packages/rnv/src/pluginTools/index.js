const getOriginalPlugin = (c, key, plugins) => {
    const plugin = plugins[key];
    if (typeof plugin === 'string' || plugin instanceof String) {
        if (plugin === 'source:rnv') {
            const origPlugin = c.files.pluginTemplatesConfig.plugins[key];
            return origPlugin;
        }
        // NOT RECOGNIZED
        return null;
    }
    return plugin;
};

export { getOriginalPlugin };
