const { withRNVMetro } = require('rnv');

module.exports = withRNVMetro({
    resolver: {
        unstable_enableSymlinks: true,
    },
});
