import { EngineManager, Config, RnvEngine } from 'rnv';
import { withRNVNext, withRNVBabel } from './adapter';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvPackage from './tasks/task.rnv.package';
import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvStart from './tasks/task.rnv.start';
import taskRnvExport from './tasks/task.rnv.export';
import taskRnvDeploy from './tasks/task.rnv.deploy';
import taskRnvDebug from './tasks/task.rnv.debug';

const { generateEngineTasks, generateEngineExtensions } = EngineManager;

const Engine: RnvEngine = {
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
    runtimeExtraProps: {},
    serverDirName: '',
    platforms: {
        web: {
            defaultPort: 8080,
            isWebHosted: true,
            extensions: generateEngineExtensions(
                ['web.browser', 'browser', 'server.next', 'server.web', 'next', 'browser.web', 'web'],
                CNF
            ),
        },
        chromecast: {
            defaultPort: 8095,
            isWebHosted: true,
            extensions: generateEngineExtensions(['chromecast.tv', 'web.tv', 'tv', 'chromecast', 'tv.web', 'web'], CNF),
        },
    },
};

// Backward compatibility
const withRNV = withRNVNext;

export { withRNV, withRNVNext, withRNVBabel };

export default Engine;
