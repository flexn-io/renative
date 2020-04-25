const config = require('../metro.config');

const sourceExts = ['tvos.tv.js', 'tv.js', 'tvos.js', 'ios.js', 'tv.native.js', 'native.js', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
