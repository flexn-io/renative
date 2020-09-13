const { Constants: { EXTENSIONS } } = require('rnv');
const config = require('../metro.config');

config.resolver.sourceExts = EXTENSIONS.androidwear;
module.exports = config;
