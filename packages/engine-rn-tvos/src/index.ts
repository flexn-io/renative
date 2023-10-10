import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvPackage from './tasks/task.rnv.package';
import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvStart from './tasks/task.rnv.start';
import taskRnvExport from './tasks/task.rnv.export';
import taskRnvDeploy from './tasks/task.rnv.deploy';
import taskRnvDebug from './tasks/task.rnv.debug';
import taskRnvCryptoInstallCerts from './tasks/task.rnv.crypto.installCerts';
import taskRnvCryptoUpdateProfile from './tasks/task.rnv.crypto.updateProfile';
import taskRnvCryptoUpdateProfiles from './tasks/task.rnv.crypto.updateProfiles';
import taskRnvCryptoInstallProfiles from './tasks/task.rnv.crypto.installProfiles';
import taskRnvLog from './tasks/task.rnv.log';
//@ts-ignore
import CNF from '../renative.engine.json';
import { withRNVBabel } from './adapters/babelAdapter';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVRNConfig } from './adapters/rnConfigAdapter';

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
    // getAliases: createEngineAlias,
    config: CNF,
    runtimeExtraProps: {
        reactNativePackageName: 'react-native-tvos',
        reactNativeMetroConfigName: 'metro.config.js',
        xcodeProjectName: 'RNVApp',
    },
    projectDirName: '',
    serverDirName: '',
    // ejectPlatform: null,
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
