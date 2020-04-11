const config = require('../metro.config');

const sourceExts = ['androidtv.tv.js', 'tv.js', 'androidtv.js', 'android.js', 'tv.native.js', 'native.js', 'js', 'tsx', 'ts'];
config.resolver.sourceExts = sourceExts;
module.exports = config;
