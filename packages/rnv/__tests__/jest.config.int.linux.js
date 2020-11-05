const config = require('./jest.config');

config.testRegex = '\\.intlinux\\.js$';
console.log('RUNNING RNV LINUX INTEGRATION TESTS');
module.exports = config;
