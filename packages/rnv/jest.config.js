import {doResolve} from './src/resolve'

module.exports = {
    collectCoverage: true,
    transform: {
        '^.+\\.js$': doResolve('react-native/jest/preprocessor.js')
    },
};
