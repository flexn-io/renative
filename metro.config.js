const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
    const dc = await getDefaultConfig();

    console.log('AAGAFDGFADGFAD', dc.resolver.sourceExts);

    return {
        resolver: {
            // sourcePlatformExts: {
            //     ios: [...dc.resolver.sourceExts],
            //     tvos: ['tvos.js', ...dc.resolver.sourceExts]
            // },
            sourceExts: [...dc.resolver.sourceExts]
        }
    };
})();
