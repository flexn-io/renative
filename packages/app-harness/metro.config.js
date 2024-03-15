const { withRNVMetro } = require('@rnv/adapter');

module.exports = withRNVMetro({
    resolver: {
        unstable_enableSymlinks: true,
    },
});
