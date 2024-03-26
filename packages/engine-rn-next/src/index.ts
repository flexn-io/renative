import { generateEngineExtensions, generateEngineTasks, RnvEngine } from '@rnv/core';
import { withRNVNext } from './adapters/nextAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import taskRun from './tasks/taskRun';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskStart from './tasks/taskStart';
import taskExport from './tasks/taskExport';
//@ts-ignore
import CNF from '../renative.engine.json';

const Engine: RnvEngine = {
    tasks: generateEngineTasks([taskRun, taskBuild, taskConfigure, taskStart, taskExport], CNF),
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

export { withRNVNext, withRNVBabel };

export default Engine;
