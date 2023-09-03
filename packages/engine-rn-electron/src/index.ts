import { Config, EngineManager, RnvContext, RnvEngine } from 'rnv';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvDebug from './tasks/task.rnv.debug';
import taskRnvDeploy from './tasks/task.rnv.deploy';
import taskRnvExport from './tasks/task.rnv.export';
import taskRnvPackage from './tasks/task.rnv.package';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvStart from './tasks/task.rnv.start';
import { withRNVBabel } from './adapter';

const { generateEngineTasks, generateEngineExtensions } = EngineManager;

const Engine: RnvEngine = {
    initializeRuntimeConfig: (c: RnvContext) => Config.initializeConfig(c),
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
