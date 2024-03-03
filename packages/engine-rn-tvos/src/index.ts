import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import taskRnvRun from './tasks/taskRun';
import taskRnvPackage from './tasks/taskPackage';
import taskRnvBuild from './tasks/taskBuild';
import taskRnvConfigure from './tasks/taskConfigure';
import taskRnvStart from './tasks/taskStart';
import taskRnvExport from './tasks/taskExport';
import taskRnvDeploy from './tasks/taskDeploy';
import taskRnvDebug from './tasks/taskDebug';
import taskRnvCryptoInstallCerts from './tasks/taskCryptoInstallCerts';
import taskRnvCryptoUpdateProfile from './tasks/taskCryptoUpdateProfile';
import taskRnvCryptoUpdateProfiles from './tasks/taskCryptoUpdateProfiles';
import taskRnvCryptoInstallProfiles from './tasks/taskCryptoInstallProfiles';
import taskRnvLog from './tasks/taskLog';
//@ts-ignore
import CNF from '../renative.engine.json';
import { withRNVBabel } from './adapters/babelAdapter';
import { withRNVMetro } from './adapters/metroAdapter';
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
        taskRnvDebug,
        taskRnvCryptoInstallCerts,
        taskRnvCryptoUpdateProfile,
        taskRnvCryptoUpdateProfiles,
        taskRnvCryptoInstallProfiles,
        taskRnvLog,
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

const withRNV = withRNVMetro;

export { withRNVMetro, withRNV, withRNVBabel, withRNVRNConfig };

export default Engine;
