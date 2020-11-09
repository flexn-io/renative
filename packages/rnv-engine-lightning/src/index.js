import { EngineManager } from 'rnv';
import CNF from '../renative.engine.json';
import taskRnvRun from './tasks/task.rnv.run';
// import taskRnvPackage from './tasks/task.rnv.package';
// import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
// import taskRnvStart from './tasks/task.rnv.start';
// import taskRnvExport from './tasks/task.rnv.export';
// import taskRnvDeploy from './tasks/task.rnv.deploy';
// import taskRnvDebug from './tasks/task.rnv.debug';


const { generateEngineTasks, generateEngineExtensions } = EngineManager;

export default {
    tasks: generateEngineTasks([
        taskRnvRun,
        // taskRnvPackage,
        // taskRnvBuild,
        taskRnvConfigure,
        // taskRnvStart,
        // taskRnvExport,
        // taskRnvDeploy,
        // taskRnvDebug,
    ]),
    config: CNF,
    projectDirName: 'project',
    ejectPlatform: null,
    platforms: {
        tizen: {
            defaultPort: 8087,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'tizen.tv', 'web.tv', 'tv', 'tizen', 'tv.web', 'web'
            ], CNF)

        },
        webos: {
            defaultPort: 8088,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'webos.tv', 'web.tv', 'tv', 'webos', 'tv.web', 'web'
            ], CNF)

        }
    }

};
