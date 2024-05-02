import { GetContextType, createRnvEngine } from '@rnv/core';
import ModuleSDKWebOS from '@rnv/sdk-webos';
import ModuleSDKTizen from '@rnv/sdk-tizen';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskRun from './tasks/taskRun';
import { Config } from './config';

const Engine = createRnvEngine({
    extendModules: [ModuleSDKWebOS, ModuleSDKTizen],
    tasks: [taskRun, taskBuild, taskConfigure],
    config: Config,
    projectDirName: 'project',
    serverDirName: 'server',
    platforms: {
        tizen: {
            defaultPort: 8087,
            isWebHosted: true,
            extensions: ['lng', 'tizen.tv', 'web.tv', 'tv', 'tizen', 'tv.web', 'web'],
        },
        webos: {
            defaultPort: 8088,
            isWebHosted: true,
            extensions: ['lng', 'webos.tv', 'web.tv', 'tv', 'webos', 'tv.web', 'web'],
        },
    },
});

export type GetContext = GetContextType<typeof Engine.getContext>;

export default Engine;
