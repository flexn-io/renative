const { Constants: { EXTENSIONS } } = require('rnv');
const config = require('../metro.config');

config.resolver.sourceExts = EXTENSIONS.tvos;
module.exports = config;
