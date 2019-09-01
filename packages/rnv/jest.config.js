module.exports = {
    collectCoverage: true,
    transform: {
        '^.+\\.js$': '<rootDir>/../../node_modules/react-native/jest/preprocessor.js'
    },
};
