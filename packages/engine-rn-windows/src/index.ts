import { RnvEngine, generateEngineTasks, generateEngineExtensions } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskDebug from './tasks/taskDebug';
import taskDeploy from './tasks/taskDeploy';
import taskExport from './tasks/taskExport';
import taskPackage from './tasks/taskPackage';
import taskRun from './tasks/taskRun';
import taskStart from './tasks/taskStart';
import { withRNVRNConfig } from '@rnv/sdk-react-native';

const Engine: RnvEngine = {
    // initializeRuntimeConfig: (c) => Context.initializeConfig(c),
    tasks: generateEngineTasks([
        taskRun,
        taskPackage,
        taskBuild,
        taskConfigure,
        taskStart,
        taskExport,
        taskDeploy,
        taskDebug,
    ]),
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

// Backward compatibility
const withRNV = withRNVMetro;

export { withRNV, withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
