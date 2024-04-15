import { createRnvEngine, GetContextType } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import { Tasks as TasksSdkApple } from '@rnv/sdk-apple';
import { Tasks as TasksSdkReactNative } from '@rnv/sdk-react-native';
import { withRNVRNConfig } from '@rnv/sdk-react-native';
import { Config } from './config';

const Engine = createRnvEngine({
    tasks: [...TasksSdkApple, ...TasksSdkReactNative],
    config: Config,
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
            extensions: ['macos.desktop', 'desktop', 'macos', 'desktop.native', 'native'],
        },
    },
});

export type GetContext = GetContextType<typeof Engine.getContext>;

export { withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
