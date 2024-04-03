import { createRnvEngine, GetContextType } from '@rnv/core';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskExport from './tasks/taskExport';
import taskRun from './tasks/taskRun';
import taskStart from './tasks/taskStart';
import { withRNVBabel } from './adapter';
import { Config } from './config';

const Engine = createRnvEngine({
    tasks: [taskRun, taskBuild, taskConfigure, taskStart, taskExport],
    config: Config,
    platforms: {
        macos: {
            defaultPort: 8086,
            isWebHosted: true,
            extensions: ['macos.desktop', 'desktop', 'macos', 'desktop.web', 'electron', 'web'],
        },
        windows: {
            defaultPort: 8092,
            isWebHosted: true,
            extensions: ['windows.desktop', 'desktop', 'windows', 'desktop.web', 'electron', 'web'],
        },
        linux: {
            defaultPort: 8100,
            isWebHosted: true,
            extensions: ['linux.desktop', 'desktop', 'linux', 'desktop.web', 'electron', 'web'],
        },
    },
});

export type GetContext = GetContextType<typeof Engine.getContext>;

export { withRNVBabel };

export default Engine;
