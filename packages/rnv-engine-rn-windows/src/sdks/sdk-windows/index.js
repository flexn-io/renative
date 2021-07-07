

import { Common, Exec, Logger, Resolver } from 'rnv';

const { logTask } = Logger;
const { executeAsync } = Exec;
const { getAppFolder } = Common;
const { doResolve } = Resolver;

export const ruWindowsProject = async (c) => {
    logTask('runWindowsProject');
    const appPath = getAppFolder(c, c.platform);

    const cmd = `node ${doResolve(
        '@react-native-windows'
    )}/cli/lib-commonjs/index.js run-windows --proj ${appPath} --logging`;

    await executeAsync(c, cmd);
    return true;
};
