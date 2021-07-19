import { EngineManager, Config } from 'rnv';
import CNF from '../renative.engine.json';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvPackage from './tasks/task.rnv.package';
import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvStart from './tasks/task.rnv.start';
// import taskRnvExport from './tasks/task.rnv.export';
// import taskRnvDeploy from './tasks/task.rnv.deploy';
// import taskRnvDebug from './tasks/task.rnv.debug';

const { generateEngineTasks, generateEngineExtensions } = EngineManager;

export default {
    initializeRuntimeConfig: c => Config.initializeConfig(c),
    tasks: generateEngineTasks([
        taskRnvRun,
        taskRnvPackage,
        taskRnvBuild,
        taskRnvConfigure,
        taskRnvStart,
        // taskRnvExport,
        // taskRnvDeploy,
        // taskRnvDebug,
    ]),
    config: CNF,
    projectDirName: 'project',
    serverDirName: 'server',
    ejectPlatform: null,
    platforms: {
        macos: {
            defaultPort: 8086,
            isWebHosted: true,
            extenstions: generateEngineExtensions(
                ['macos.desktop', 'desktop', 'macos'],
                CNF
            ),
        },
    },
};
