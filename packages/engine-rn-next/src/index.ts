import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import { withRNVNext } from './adapters/nextAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
//@ts-ignore
import CNF from '../renative.engine.json';
import taskRnvRun from './tasks/taskRun';
import taskRnvPackage from './tasks/taskPackage';
import taskRnvBuild from './tasks/taskBuild';
import taskRnvConfigure from './tasks/taskConfigure';
import taskRnvStart from './tasks/taskStart';
import taskRnvExport from './tasks/taskExport';
import taskRnvDeploy from './tasks/taskDeploy';
import taskRnvDebug from './tasks/taskDebug';

const Engine: RnvEngine = {
    // initializeRuntimeConfig: (c) => Context.initializeConfig(c),
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
