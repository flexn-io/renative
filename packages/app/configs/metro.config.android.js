const config = require('../metro.config');

const sourceExts = ['android.mobile.js', 'mobile.js', 'android.js', 'mobile.native.js', 'native.js', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
