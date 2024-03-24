import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import { Tasks as TasksSdkApple } from '@rnv/sdk-apple';
import taskStart from './tasks/taskStart';
import { withRNVRNConfig } from '@rnv/sdk-react-native';
//@ts-ignore
import CNF from '../renative.engine.json';

const Engine: RnvEngine = {
    tasks: generateEngineTasks([taskStart, ...TasksSdkApple]),
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
