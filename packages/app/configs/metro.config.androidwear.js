const config = require('../metro.config');

const sourceExts = ['androidwear.watch.js', 'watch.js', 'androidwear.js', 'android.js', 'watch.native.js', 'native.js', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
