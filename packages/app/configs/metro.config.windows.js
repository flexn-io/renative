const config = require('../metro.config');

const sourceExts = ['windows.desktop.js', 'desktop.js', 'windows.js', 'desktop.web.js', 'electron.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
