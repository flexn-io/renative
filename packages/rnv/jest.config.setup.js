const config = require('./jest.config');

config.testRegex = '\\.setuptest\\.js$';
console.log('RUNNING SETUP TESTS');
module.exports = config;
