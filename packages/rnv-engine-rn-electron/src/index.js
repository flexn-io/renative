import { Config, EngineManager } from 'rnv';
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
    initializeRuntimeConfig: c => Config.initializeConfig(c),
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
    projectDirName: 'project',
    serverDirName: 'project',
    ejectPlatform: null,
    platforms: {
        macos: {
            defaultPort: 8086,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'macos.desktop', 'desktop', 'macos', 'desktop.web', 'electron', 'web'
            ], CNF)

        },
        windows: {
            defaultPort: 8092,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'windows.desktop', 'desktop', 'windows', 'desktop.web', 'electron', 'web'
            ], CNF)

        },
        linux: {
            defaultPort: 8100,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'linux.desktop', 'desktop', 'linux', 'desktop.web', 'electron', 'web'
            ], CNF)

        }
    }

};
