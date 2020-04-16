const config = require('../metro.config');

const sourceExts = ['chromecast.tv.js', 'web.tv.js', 'tv.js', 'chromecast.js', 'tv.web.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
