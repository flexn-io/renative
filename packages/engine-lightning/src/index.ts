import { RnvEngine, generateEngineTasks, generateEngineExtensions } from '@rnv/core';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskRnvBuild from './tasks/taskBuild';
import taskRnvConfigure from './tasks/taskConfigure';
import taskRnvRun from './tasks/taskRun';

const Engine: RnvEngine = {
    // initializeRuntimeConfig: (c) => Context.initializeConfig(c),
    tasks: generateEngineTasks([
        taskRnvRun,
        // taskRnvPackage,
        taskRnvBuild,
        taskRnvConfigure,
        // taskRnvStart,
        // taskRnvExport,
        // taskRnvDeploy,
        // taskRnvDebug,
    ]),
    config: CNF,
    projectDirName: 'project',
    serverDirName: 'server',
    runtimeExtraProps: {},
    // ejectPlatform: null,
    platforms: {
        tizen: {
            defaultPort: 8087,
            isWebHosted: true,
            extensions: generateEngineExtensions(['lng', 'tizen.tv', 'web.tv', 'tv', 'tizen', 'tv.web', 'web'], CNF),
        },
        webos: {
            defaultPort: 8088,
            isWebHosted: true,
            extensions: generateEngineExtensions(['lng', 'webos.tv', 'web.tv', 'tv', 'webos', 'tv.web', 'web'], CNF),
        },
    },
};

export default Engine;
