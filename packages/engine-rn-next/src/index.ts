import { createRnvEngine, GetContextType } from '@rnv/core';
import { withRNVNext } from './adapters/nextAdapter';
import { withRNVBabel } from './adapters/babelAdapter';
import taskRun from './tasks/taskRun';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskStart from './tasks/taskStart';
import taskExport from './tasks/taskExport';
import { Config } from './config';

const Engine = createRnvEngine({
    tasks: [taskRun, taskBuild, taskConfigure, taskStart, taskExport],
    config: Config,
    platforms: {
        web: {
            defaultPort: 8080,
            isWebHosted: true,
            extensions: ['web.browser', 'browser', 'server.next', 'server.web', 'next', 'browser.web', 'web'],
        },
        chromecast: {
            defaultPort: 8095,
            isWebHosted: true,
            extensions: ['chromecast.tv', 'web.tv', 'tv', 'chromecast', 'tv.web', 'web'],
        },
    },
});

export type GetContext = GetContextType<typeof Engine.getContext>;

export { withRNVNext, withRNVBabel };

export default Engine;
