import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskRnvBuild from './tasks/taskBuild';
import taskRnvConfigure from './tasks/taskConfigure';
import taskRnvDebug from './tasks/taskDebug';
import taskRnvDeploy from './tasks/taskDeploy';
import taskRnvExport from './tasks/taskExport';
import taskRnvPackage from './tasks/taskPackage';
import taskRnvRun from './tasks/taskRun';
import taskRnvStart from './tasks/taskStart';
import { withRNVBabel } from './adapter';

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
