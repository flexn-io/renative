import { RnvEngine, generateEngineTasks, generateEngineExtensions } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskExport from './tasks/taskExport';
import taskPackage from './tasks/taskPackage';
import taskRun from './tasks/taskRun';
import taskStart from './tasks/taskStart';
import { withRNVRNConfig } from '@rnv/sdk-react-native';

const Engine: RnvEngine = {
    tasks: generateEngineTasks([taskRun, taskPackage, taskBuild, taskConfigure, taskStart, taskExport]),
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
