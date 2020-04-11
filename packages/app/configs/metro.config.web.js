const config = require('../metro.config');

const sourceExts = ['browser.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
