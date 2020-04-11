const config = require('../metro.config');

const sourceExts = ['tizenmobile.mobile.js', 'mobile.js', 'tizenmobile.js', 'mobile.web.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
