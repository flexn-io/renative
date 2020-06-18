const { EXTENSIONS } = require('rnv/dist/constants');
const config = require('../metro.config');

config.resolver.sourceExts = EXTENSIONS.firefoxos;
module.exports = config;
