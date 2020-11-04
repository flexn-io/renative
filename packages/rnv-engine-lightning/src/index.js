import path from 'path';
import { EngineManager } from 'rnv';
import CNF from '../renative.engine.json';
import taskRnvRun from './tasks/task.rnv.run';
import taskRnvConfigure from './tasks/task.rnv.configure';

const { generateEngineTasks, generateEngineExtensions } = EngineManager;
const ex = EngineManager.registerEngineExtension;
const ext = CNF.engineExtension;


export default {
    tasks: generateEngineTasks([taskRnvRun, taskRnvConfigure]),
    config: CNF,
    templateProjectDir: 'project',
    originalPlatformTemplatesDir: path.join(__dirname, '../platformTemplates'),
    ejectPlatform: null,
    platforms: {
        tizen: {
            defaultPort: 8086,
            isWebHosted: true,
            extenstions: generateEngineExtensions([
                'macos.desktop', 'desktop', 'macos', 'desktop.web', 'electron', 'web'
            ])
        },
        webos: {
            defaultPort: 8092,
            isWebHosted: true,
            extenstions: [
                ...ex(CNF.id), ...ex('windows.desktop', ext), ...ex('desktop', ext), ...ex('windows', ext),
                ...ex('desktop.web', ext), ...ex('electron', ext), ...ex('web', ext), ...ex()
            ]
        }
    }
};
