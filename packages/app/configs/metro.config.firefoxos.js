const config = require('../metro.config');

const sourceExts = ['firefoxos.mobile.js', 'mobile.js', 'firefoxos.js', 'mobile.web.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
