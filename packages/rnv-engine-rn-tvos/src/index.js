import { EngineManager, Config } from 'rnv';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvStart from './tasks/task.rnv.start';
import CNF from '../renative.engine.json';

export { withRNV, createEngineAlias } from './adapter';

const { generateEngineTasks, generateEngineExtensions } = EngineManager;

export default {
    initializeRuntimeConfig: c => Config.initializeConfig(c),
    tasks: generateEngineTasks([
        taskRnvRun,
        taskRnvConfigure,
        taskRnvStart,
    ]),
    config: CNF,
    projectDirName: '',
    ejectPlatform: null,
    platforms: {
        tvos: {
            defaultPort: 8089,
            extenstions: generateEngineExtensions([
                'tvos.tv', 'tv', 'tvos', 'tv.native', 'native'
            ], CNF)
        },
    }
};
