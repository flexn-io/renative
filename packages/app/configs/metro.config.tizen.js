const config = require('../metro.config');

const sourceExts = ['tizen.tv.js', 'web.tv.js', 'tv.js', 'tizen.js', 'tv.web.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
