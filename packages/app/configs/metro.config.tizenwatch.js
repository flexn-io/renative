const config = require('../metro.config');

const sourceExts = ['tizenwatch.watch.js', 'watch.js', 'tizenwatch.js', 'watch.web.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
