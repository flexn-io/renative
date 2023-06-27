import { Config, EngineManager } from 'rnv';
import { withRNV } from './adapter';
import CNF from '../renative.engine.json';
import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvDebug from './tasks/task.rnv.debug';
import taskRnvDeploy from './tasks/task.rnv.deploy';
import taskRnvExport from './tasks/task.rnv.export';
import taskRnvPackage from './tasks/task.rnv.package';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvStart from './tasks/task.rnv.start';

const { generateEngineTasks, generateEngineExtensions } = EngineManager;

export default {
    initializeRuntimeConfig: (c) => Config.initializeConfig(c),
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
    ejectPlatform: null,
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

export { withRNV };
