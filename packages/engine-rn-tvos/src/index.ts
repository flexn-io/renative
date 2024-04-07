import { createRnvEngine, GetContextType } from '@rnv/core';
import { Tasks as TasksSdkAndroid } from '@rnv/sdk-android';
import { Tasks as TasksSdkApple } from '@rnv/sdk-apple';
import { Tasks as TasksSdkReactNative } from '@rnv/sdk-react-native';
import { withRNVBabel } from './adapters/babelAdapter';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVRNConfig } from '@rnv/sdk-react-native';
import { Config } from './config';

const Engine = createRnvEngine({
    tasks: [...TasksSdkAndroid, ...TasksSdkApple, ...TasksSdkReactNative],
    config: Config,
    runtimeExtraProps: {
        reactNativePackageName: 'react-native-tvos',
        reactNativeMetroConfigName: 'metro.config.js',
        xcodeProjectName: 'RNVApp',
    },
    projectDirName: '',
    serverDirName: '',
    platforms: {
        tvos: {
            defaultPort: 8089,
            extensions: ['tvos.tv', 'tv', 'tvos', 'tv.native', 'native'],
        },
        androidtv: {
            defaultPort: 8084,
            extensions: ['androidtv.tv', 'tv', 'androidtv', 'android', 'tv.native', 'native'],
        },
        firetv: {
            defaultPort: 8098,
            extensions: ['firetv.tv', 'androidtv.tv', 'tv', 'firetv', 'androidtv', 'android', 'tv.native', 'native'],
        },
    },
});

export type GetContext = GetContextType<typeof Engine.getContext>;

export { withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
