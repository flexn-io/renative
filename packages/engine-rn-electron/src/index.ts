import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
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
import { withRNVBabel } from './adapter';

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
    serverDirName: '',
    // ejectPlatform: null,
    runtimeExtraProps: {},
    platforms: {
        macos: {
            defaultPort: 8086,
            isWebHosted: true,
            extensions: generateEngineExtensions(
                ['macos.desktop', 'desktop', 'macos', 'desktop.web', 'electron', 'web'],
                CNF
            ),
        },
        windows: {
            defaultPort: 8092,
            isWebHosted: true,
            extensions: generateEngineExtensions(
                ['windows.desktop', 'desktop', 'windows', 'desktop.web', 'electron', 'web'],
                CNF
            ),
        },
        linux: {
            defaultPort: 8100,
            isWebHosted: true,
            extensions: generateEngineExtensions(
                ['linux.desktop', 'desktop', 'linux', 'desktop.web', 'electron', 'web'],
                CNF
            ),
        },
    },
};

export { withRNVBabel };

export default Engine;
