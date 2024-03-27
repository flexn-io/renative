import { generateEngineExtensions, generateRnvTaskMap, RnvEngine } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import { Tasks as TasksSdkApple } from '@rnv/sdk-apple';
import { Tasks as TasksSdkReactNative } from '@rnv/sdk-react-native';
import { withRNVRNConfig } from '@rnv/sdk-react-native';
//@ts-ignore
import CNF from '../renative.engine.json';

const Engine: RnvEngine = {
    tasks: generateRnvTaskMap([...TasksSdkApple, ...TasksSdkReactNative], CNF),
    config: CNF,
    runtimeExtraProps: {
        reactNativePackageName: 'react-native',
        reactNativeMetroConfigName: 'metro.config.js',
        xcodeProjectName: 'RNVAppMACOS',
    },
    projectDirName: '',
    serverDirName: 'server',
    platforms: {
        macos: {
            defaultPort: 8086,
            extensions: generateEngineExtensions(
                ['macos.desktop', 'desktop', 'macos', 'desktop.native', 'native'],
                CNF
            ),
        },
    },
};

export { withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
