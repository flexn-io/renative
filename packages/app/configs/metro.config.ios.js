const { Constants: { EXTENSIONS } } = require('rnv');
const config = require('../metro.config');

config.resolver.sourceExts = EXTENSIONS.ios;
module.exports = config;
