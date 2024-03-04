import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import { withRNVBabel, withRNV } from './adapter';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskRun from './tasks/taskRun';
import taskPackage from './tasks/taskPackage';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskStart from './tasks/taskStart';
import taskExport from './tasks/taskExport';
import taskDeploy from './tasks/taskDeploy';
import taskDebug from './tasks/taskDebug';

const Engine: RnvEngine = {
    // initializeRuntimeConfig: (c) => Context.initializeConfig(c),
    tasks: generateEngineTasks([
        taskRun,
        taskPackage,
        taskBuild,
        taskConfigure,
        taskStart,
        taskExport,
        taskDeploy,
        taskDebug,
    ]),
    config: CNF,
    projectDirName: '',
    serverDirName: '',
    runtimeExtraProps: {},
    platforms: {
        web: {
            defaultPort: 8080,
            isWebHosted: true,
            extensions: generateEngineExtensions(['web.browser', 'browser', 'browser.web', 'web'], CNF),
        },
        chromecast: {
            defaultPort: 8095,
            isWebHosted: true,
            extensions: generateEngineExtensions(['chromecast.tv', 'web.tv', 'tv', 'chromecast', 'tv.web', 'web'], CNF),
        },
        tizen: {
            defaultPort: 8087,
            isWebHosted: true,
            extensions: generateEngineExtensions(['tizen.tv', 'web.tv', 'tv', 'tizen', 'tv.web', 'web'], CNF),
        },
        webtv: {
            defaultPort: 8096,
            isWebHosted: true,
            extensions: generateEngineExtensions(['webtv.tv', 'web.tv', 'tv', 'webtv', 'tv.web', 'web'], CNF),
        },
        tizenmobile: {
            defaultPort: 8091,
            isWebHosted: true,
            extensions: generateEngineExtensions(
                ['tizenmobile.mobile', 'mobile', 'tizenmobile', 'mobile.web', 'native'],
                CNF
            ),
        },
        tizenwatch: {
            defaultPort: 8090,
            isWebHosted: true,
            extensions: generateEngineExtensions(
                ['tizenwatch.watch', 'web.watch', 'watch', 'tizenwatch', 'watch.web', 'web'],
                CNF
            ),
        },
        webos: {
            defaultPort: 8088,
            isWebHosted: true,
            extensions: generateEngineExtensions(['webos.tv', 'web.tv', 'tv', 'webos', 'tv.web', 'web'], CNF),
        },
        kaios: {
            defaultPort: 8093,
            isWebHosted: true,
            extensions: generateEngineExtensions(['kaios.mobile', 'mobile', 'kaios', 'mobile.web', 'native'], CNF),
        },
    },
};

export { withRNVBabel, withRNV };

export default Engine;
