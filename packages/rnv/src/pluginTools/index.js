import merge from 'deepmerge';

const _arrayMerge = (destinationArray, sourceArray, mergeOptions) => {
    const jointArray = destinationArray.concat(sourceArray);
    const uniqueArray = jointArray.filter((item, index) => jointArray.indexOf(item) === index);
    return uniqueArray;
};

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
        return merge(origPlugin, plugin, { arrayMerge: _arrayMerge });
    }

    return plugin;
};

export { getMergedPlugin };
