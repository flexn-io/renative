import { createRnvEngine, GetContextType } from '@rnv/core';
import { Tasks as TasksSdkWebOS } from '@rnv/sdk-webos';
import { Tasks as TasksSdkTizen } from '@rnv/sdk-tizen';
import { withRNVBabel, withRNVWebpack } from './adapter';
import taskRun from './tasks/taskRun';
import taskBuild from './tasks/taskBuild';
import taskConfigure from './tasks/taskConfigure';
import taskStart from './tasks/taskStart';
import taskDebug from './tasks/taskDebug';
import { Config } from './config';

const Engine = createRnvEngine({
    tasks: [taskRun, taskBuild, taskConfigure, taskStart, taskDebug, ...TasksSdkWebOS, ...TasksSdkTizen],
    config: Config,
    platforms: {
        web: {
            defaultPort: 8080,
            isWebHosted: true,
            extensions: ['web.browser', 'browser', 'browser.web', 'web'],
        },
        chromecast: {
            defaultPort: 8095,
            isWebHosted: true,
            extensions: ['chromecast.tv', 'web.tv', 'tv', 'chromecast', 'tv.web', 'web'],
        },
        tizen: {
            defaultPort: 8087,
            isWebHosted: true,
            extensions: ['tizen.tv', 'web.tv', 'tv', 'tizen', 'tv.web', 'web'],
        },
        webtv: {
            defaultPort: 8096,
            isWebHosted: true,
            extensions: ['webtv.tv', 'web.tv', 'tv', 'webtv', 'tv.web', 'web'],
        },
        tizenmobile: {
            defaultPort: 8091,
            isWebHosted: true,
            extensions: ['tizenmobile.mobile', 'mobile', 'tizenmobile', 'mobile.web', 'native'],
        },
        tizenwatch: {
            defaultPort: 8090,
            isWebHosted: true,
            extensions: ['tizenwatch.watch', 'web.watch', 'watch', 'tizenwatch', 'watch.web', 'web'],
        },
        webos: {
            defaultPort: 8088,
            isWebHosted: true,
            extensions: ['webos.tv', 'web.tv', 'tv', 'webos', 'tv.web', 'web'],
        },
        kaios: {
            defaultPort: 8093,
            isWebHosted: true,
            extensions: ['kaios', 'kaios.mobile', 'mobile', 'mobile.web', 'native', 'web'],
        },
    },
});

export type GetContext = GetContextType<typeof Engine.getContext>;

//TODO: export this withing engine
export { withRNVBabel, withRNVWebpack };

export default Engine;
