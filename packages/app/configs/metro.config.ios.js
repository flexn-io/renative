const config = require('../metro.config');

const sourceExts = ['ios.mobile.js', 'mobile.js', 'ios.js', 'mobile.native.js', 'native.js', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
