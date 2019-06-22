const path = require('path');

module.exports = {
    rootDir: path.join(__dirname, '../'),
    preset: 'react-native',
    transform: {
        '^.+\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js'
    }
};
