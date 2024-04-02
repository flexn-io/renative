import { GetContextType, createRnvEngine } from '@rnv/core';
import { Tasks as TasksSdkWebOS } from '@rnv/sdk-webos';
import { Tasks as TasksSdkTizen } from '@rnv/sdk-tizen';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskRun from './tasks/taskRun';
import { Config } from './config';

const Engine = createRnvEngine({
    tasks: [taskRun, taskBuild, taskConfigure, ...TasksSdkWebOS, ...TasksSdkTizen],
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
