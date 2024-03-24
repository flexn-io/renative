import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import { Tasks as TasksSdkAndroid } from '@rnv/sdk-android';
import { Tasks as TasksSdkApple } from '@rnv/sdk-apple';
import { Tasks as TasksSdkReactNative, withRNVRNConfig } from '@rnv/sdk-react-native';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
//@ts-ignore
import CNF from '../renative.engine.json';

const Engine: RnvEngine = {
    tasks: generateEngineTasks([...TasksSdkAndroid, ...TasksSdkApple, ...TasksSdkReactNative]),
    config: CNF,
    runtimeExtraProps: {
        reactNativePackageName: 'react-native',
        reactNativeMetroConfigName: 'metro.config.js',
        xcodeProjectName: 'RNVApp',
    },
    projectDirName: '',
    serverDirName: '',
    // package: '',
    // ejectPlatform: null,
    platforms: {
        ios: {
            defaultPort: 8082,
            extensions: generateEngineExtensions(['ios.mobile', 'mobile', 'ios', 'mobile.native', 'native'], CNF),
        },
        android: {
            defaultPort: 8083,
            extensions: generateEngineExtensions(
                ['android.mobile', 'mobile', 'android', 'mobile.native', 'native'],
                CNF
            ),
        },
        androidtv: {
            defaultPort: 8084,
            extensions: generateEngineExtensions(
                ['androidtv.tv', 'tv', 'androidtv', 'android', 'tv.native', 'native'],
                CNF
            ),
        },
        firetv: {
            defaultPort: 8098,
            extensions: generateEngineExtensions(
                ['firetv.tv', 'androidtv.tv', 'tv', 'firetv', 'androidtv', 'android', 'tv.native', 'native'],
                CNF
            ),
        },
        androidwear: {
            defaultPort: 8084,
            extensions: generateEngineExtensions(
                ['androidwear.watch', 'watch', 'androidwear', 'android', 'watch.native', 'native'],
                CNF
            ),
        },
        macos: {
            defaultPort: 8086,
            extensions: generateEngineExtensions(
                ['macos.desktop', 'desktop', 'macos', 'ios', 'desktop.native', 'native'],
                CNF
            ),
        },
    },
};

export default Engine;

export { withRNVMetro, withRNVBabel, withRNVRNConfig };
