import { createRnvEngine, GetContextType } from '@rnv/core';
import { withRNVMetro } from './adapters/metroAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskExport from './tasks/taskExport';
import taskPackage from './tasks/taskPackage';
import taskRun from './tasks/taskRun';
import ModuleSDKReactNative, { withRNVRNConfig } from '@rnv/sdk-react-native';

import { Config } from './config';

const Engine = createRnvEngine({
    extendModules: [ModuleSDKReactNative],
    tasks: [taskRun, taskPackage, taskBuild, taskConfigure, taskExport],
    config: Config,
    platforms: {
        windows: {
            defaultPort: 8092,
            extensions: ['windows.desktop', 'windows', 'win', 'desktop'],
        },
        xbox: {
            defaultPort: 8099,
            // What works on windows will work on xbox, but it needs to be scaled as for TVs
            extensions: ['xbox', 'windows', 'win', 'tv', 'desktop'],
        },
    },
});

export type GetContext = GetContextType<typeof Engine.getContext>;

export { withRNVMetro, withRNVBabel, withRNVRNConfig };

export default Engine;
