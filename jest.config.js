module.exports = {
    preset: 'react-native',
    testEnvironment: 'jsdom',
    testMatch: ['**/src/**/__tests__/**/*.(js|ts)?(x)', '**/src/**/?(*.)+(spec|test).(js|ts)?(x)'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!([@]?react-native.*|renative|lodash-es)/)'],
    modulePathIgnorePatterns: ['lib'],
};
