import { EngineManager } from 'rnv';
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

export default {
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
    ejectPlatform: null,
    platforms: {
        web: {
            defaultPort: 8080,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'web.browser', 'browser', 'browser.web', 'web'
            ], CNF)

        },
        chromecast: {
            defaultPort: 8095,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'chromecast.tv', 'web.tv', 'tv', 'chromecast', 'tv.web', 'web'
            ], CNF)

        },
        tizen: {
            defaultPort: 8087,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'tizen.tv', 'web.tv', 'tv', 'tizen', 'tv.web', 'web'
            ], CNF)

        },
        tizenmobile: {
            defaultPort: 8091,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'tizenmobile.mobile', 'mobile', 'tizenmobile', 'mobile.web', 'native'
            ], CNF)

        },
        tizenwatch: {
            defaultPort: 8090,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'tizenwatch.watch', 'web.watch', 'watch', 'tizenwatch', 'watch.web', 'web'
            ], CNF)

        },
        webos: {
            defaultPort: 8088,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'webos.tv', 'web.tv', 'tv', 'webos', 'tv.web', 'web'
            ], CNF)

        },
        firefoxos: {
            defaultPort: 8094,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'firefoxos.mobile', 'mobile', 'firefoxos', 'mobile.web', 'native'
            ], CNF)

        },
        firefoxtv: {
            defaultPort: 8014,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'firefoxtv.tv', 'web.tv', 'tv', 'firefoxtv', 'tv.web', 'web'
            ], CNF)

        },
        kaios: {
            defaultPort: 8093,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'kaios.mobile', 'mobile', 'kaios', 'mobile.web', 'native'
            ], CNF)

        }
    }

};
