import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskRnvRun from './tasks/taskRun';
import taskRnvPackage from './tasks/taskPackage';
import taskRnvBuild from './tasks/taskBuild';
import taskRnvConfigure from './tasks/taskConfigure';
import taskRnvStart from './tasks/taskStart';
import taskRnvExport from './tasks/taskExport';
import taskRnvDeploy from './tasks/taskDeploy';
import { withRNVRNConfig } from '@rnv/sdk-react-native';

const Engine: RnvEngine = {
    // initializeRuntimeConfig: (c) => Context.initializeConfig(c),
    tasks: generateEngineTasks([
        taskRnvRun,
        taskRnvPackage,
        taskRnvBuild,
        taskRnvConfigure,
        taskRnvStart,
        taskRnvExport,
        taskRnvDeploy,
        // taskRnvLog,
    ]),
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

// Backward compatibility
const withRNV = withRNVMetro;

export { withRNV, withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
