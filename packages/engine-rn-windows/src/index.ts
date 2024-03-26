import { RnvEngine, generateEngineTasks, generateEngineExtensions } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskExport from './tasks/taskExport';
import taskPackage from './tasks/taskPackage';
import taskRun from './tasks/taskRun';
import { Tasks as TasksSdkReactNative, withRNVRNConfig } from '@rnv/sdk-react-native';
//@ts-ignore
import CNF from '../renative.engine.json';

const Engine: RnvEngine = {
    tasks: generateEngineTasks(
        [taskRun, taskPackage, taskBuild, taskConfigure, taskExport, ...TasksSdkReactNative],
        CNF
    ),
    config: CNF,
    projectDirName: '',
    runtimeExtraProps: {},
    serverDirName: '',
    platforms: {
        windows: {
            defaultPort: 8092,
            extensions: generateEngineExtensions(['windows.desktop', 'windows', 'win', 'desktop'], CNF),
        },
        xbox: {
            defaultPort: 8099,
            // What works on windows will work on xbox, but it needs to be scaled as for TVs
            extensions: generateEngineExtensions(['xbox', 'windows', 'win', 'tv', 'desktop'], CNF),
        },
    },
};

export { withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
