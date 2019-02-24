import { logTask } from '../common';
import { execShellAsync } from '../exec';

function buildWeb(c, platform) {
    logTask('buildWeb');
    return execShellAsync(`NODE_ENV=production webpack -p --config ./platformBuilds/${c.appId}_${platform}/webpack.config.js`);
}

export { buildWeb };
