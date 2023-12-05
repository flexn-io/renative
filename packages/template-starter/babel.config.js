const { withRNVBabel } = require('rnv');

module.exports = withRNVBabel({});

module.exports = function (api) {
    api.cache(true);
    return {};
};
