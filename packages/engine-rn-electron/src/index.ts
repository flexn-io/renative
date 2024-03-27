import { generateEngineExtensions, generateRnvTaskMap, RnvEngine } from '@rnv/core';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskExport from './tasks/taskExport';
import taskRun from './tasks/taskRun';
import taskStart from './tasks/taskStart';
import { withRNVBabel } from './adapter';

//@ts-ignore
import PKG from '../package.json';

const Engine: RnvEngine = {
    tasks: generateRnvTaskMap([taskRun, taskBuild, taskConfigure, taskStart, taskExport], PKG),
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
