
const config = {
  root: './',
  reactNativePath: '../../node_modules/react-native',
  platforms: {
    ios: {},
    android: {},
  },
  project: {
    ios: {
      sourceDir: './platformBuilds/app_ios',
    },
    android: {
      appName: 'app',
      sourceDir: './platformBuilds/app_android',
      packageName: 'com.testrnproject',
    },
  },
};

module.exports = config;
