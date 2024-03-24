import { RnvEngine, generateEngineTasks, generateEngineExtensions } from '@rnv/core';
import { Tasks as TasksSdkWebOS } from '@rnv/sdk-webos';
import { Tasks as TasksSdkTizen } from '@rnv/sdk-tizen';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskRun from './tasks/taskRun';
//@ts-ignore
import CNF from '../renative.engine.json';

const Engine: RnvEngine = {
    tasks: generateEngineTasks([taskRun, taskBuild, taskConfigure, ...TasksSdkWebOS, ...TasksSdkTizen]),
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
