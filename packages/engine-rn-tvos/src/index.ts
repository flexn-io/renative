import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import { Tasks as TasksAndroid } from '@rnv/sdk-android';
import { Tasks as TasksApple } from '@rnv/sdk-apple';
import taskRun from './tasks/taskRun';
import taskPackage from './tasks/taskPackage';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskStart from './tasks/taskStart';
import taskExport from './tasks/taskExport';

import taskLog from './tasks/taskLog';
//@ts-ignore
import CNF from '../renative.engine.json';
import { withRNVBabel } from './adapters/babelAdapter';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVRNConfig } from '@rnv/sdk-react-native';

const Engine: RnvEngine = {
    tasks: generateEngineTasks([
        taskRun,
        taskPackage,
        taskBuild,
        taskConfigure,
        taskStart,
        taskExport,
        taskLog,
        ...TasksAndroid,
        ...TasksApple,
    ]),
    config: CNF,
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
            extensions: generateEngineExtensions(['tvos.tv', 'tv', 'tvos', 'tv.native', 'native'], CNF),
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
    },
};

export { withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
