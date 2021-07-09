

import { Common, Exec, Logger, Resolver, ProjectManager } from 'rnv';
import { copyProjectTemplateAndReplace } from './copyTemplate';

const { logTask } = Logger;
const { executeAsync } = Exec;
const { getAppFolder } = Common;
const { doResolve } = Resolver;
const { copyBuildsFolder } = ProjectManager;


export const ruWindowsProject = async (c) => {
    logTask('runWindowsProject');
    const appPath = getAppFolder(c, c.platform);

    const cmd = `node ${doResolve(
        '@react-native-windows/cli'
    )}/lib-commonjs/index.js run-windows --proj ${appPath} --logging`;

    await executeAsync(c, cmd);
    return true;
};

export { copyProjectTemplateAndReplace as configureWindowsProject };
