const config = require('../metro.config');

const sourceExts = ['browser.js', 'next.js', 'web.js', 'mjs', 'js', 'jsx', 'json', 'wasm', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
