const config = require('../metro.config');

const sourceExts = ['kaios.mobile.js', 'mobile.js', 'kaios.js', 'mobile.web.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
