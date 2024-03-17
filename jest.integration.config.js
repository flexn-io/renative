module.exports = {
    collectCoverage: false,
    globals: {
        NODE_ENV: 'test',
    },
    preset: 'react-native',
    testTimeout: 2 * 60 * 1000,
    // reporters: [
    //     'default',
    // ],
    transformIgnorePatterns: [],
    modulePathIgnorePatterns: ['lib'],
    testMatch: [
        '**/src/**/__tests__/**/*.integration.(js|ts)?(x)',
        '**/src/**/?(*.integration.)+(spec|test).(js|ts)?(x)',
    ],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    verbose: true,
};
