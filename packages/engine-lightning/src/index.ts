import { RnvEngine, generateEngineTasks, generateEngineExtensions } from '@rnv/core';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskRun from './tasks/taskRun';

const Engine: RnvEngine = {
    tasks: generateEngineTasks([taskRun, taskBuild, taskConfigure]),
    config: CNF,
    projectDirName: '',
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
