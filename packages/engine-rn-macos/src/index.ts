import { createRnvEngine, GetContextType } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import ModuleSDKApple from '@rnv/sdk-apple';
import ModuleSDKReactNative from '@rnv/sdk-react-native';
import { withRNVRNConfig } from '@rnv/sdk-react-native';
import { Config } from './config';

const Engine = createRnvEngine({
    extendModules: [ModuleSDKApple, ModuleSDKReactNative],
    tasks: [],
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
