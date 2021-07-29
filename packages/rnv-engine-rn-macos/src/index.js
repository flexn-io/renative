import { EngineManager, Config } from 'rnv';
import { withRNV } from './adapter';
import CNF from '../renative.engine.json';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvPackage from './tasks/task.rnv.package';
import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvStart from './tasks/task.rnv.start';
import taskRnvExport from './tasks/task.rnv.export';
// import taskRnvDeploy from './tasks/task.rnv.deploy';
// import taskRnvLog from './tasks/task.rnv.log';

const { generateEngineTasks, generateEngineExtensions } = EngineManager;

export default {
    initializeRuntimeConfig: c => Config.initializeConfig(c),
    tasks: generateEngineTasks([
        taskRnvRun,
        taskRnvPackage,
        taskRnvBuild,
        taskRnvConfigure,
        taskRnvStart,
        taskRnvExport,
        // taskRnvDeploy,
        // taskRnvLog,
    ]),
    config: CNF,
    projectDirName: '',
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

export { withRNV };
