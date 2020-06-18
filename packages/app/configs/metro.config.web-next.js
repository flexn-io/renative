const { EXTENSIONS } = require('rnv/dist/constants');
const config = require('../metro.config');

config.resolver.sourceExts = EXTENSIONS['web-next'];
module.exports = config;
