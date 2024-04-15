import { createRnvEngine, GetContextType } from '@rnv/core';
import { Tasks as TasksSdkAndroid } from '@rnv/sdk-android';
import { Tasks as TasksSdkApple } from '@rnv/sdk-apple';
import { Tasks as TasksSdkReactNative, withRNVRNConfig } from '@rnv/sdk-react-native';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import { Config } from './config';

const Engine = createRnvEngine({
    tasks: [...TasksSdkAndroid, ...TasksSdkApple, ...TasksSdkReactNative],
    config: Config,
    runtimeExtraProps: {
        reactNativePackageName: 'react-native',
        reactNativeMetroConfigName: 'metro.config.js',
        xcodeProjectName: 'RNVApp',
    },
    platforms: {
        ios: {
            defaultPort: 8082,
            extensions: ['ios.mobile', 'mobile', 'ios', 'mobile.native', 'native'],
        },
        android: {
            defaultPort: 8083,
            extensions: ['android.mobile', 'mobile', 'android', 'mobile.native', 'native'],
        },
        androidtv: {
            defaultPort: 8084,
            extensions: ['androidtv.tv', 'tv', 'androidtv', 'android', 'tv.native', 'native'],
        },
        firetv: {
            defaultPort: 8098,
            extensions: ['firetv.tv', 'androidtv.tv', 'tv', 'firetv', 'androidtv', 'android', 'tv.native', 'native'],
        },
        androidwear: {
            defaultPort: 8084,
            extensions: ['androidwear.watch', 'watch', 'androidwear', 'android', 'watch.native', 'native'],
        },
        macos: {
            defaultPort: 8086,
            extensions: ['macos.desktop', 'desktop', 'macos', 'ios', 'desktop.native', 'native'],
        },
    },
});

export type GetContext = GetContextType<typeof Engine.getContext>;

export default Engine;

export { withRNVMetro, withRNVBabel, withRNVRNConfig };
