const config = require('../metro.config');

const sourceExts = ['firefoxtv.tv.js', 'web.tv.js', 'tv.js', 'firefoxtv.js', 'tv.web.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
