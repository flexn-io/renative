const config = require('../metro.config');

const sourceExts = ['macos.desktop.js', 'desktop.js', 'macos.js', 'desktop.web.js', 'electron.js', 'web.js', 'mjs', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
