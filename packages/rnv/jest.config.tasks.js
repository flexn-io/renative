const config = require('./jest.config');

config.testMatch = ['**/src/**/__tests__/**/*.js?(x)', '**/src/**/?(*.)+(spec|test).js?(x)'],
console.log('RUNNING TASK TESTS');
module.exports = config;
