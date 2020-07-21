/* eslint-disable import/no-cycle */

import { inquirerPrompt } from '../cli/prompt';
import {
    logTask,
    logRaw
} from '../core/systemManager/logger';
import { getWorkspaceConnectionString } from '../core/projectManager/workspace';


export const taskRnvWorkspaceConnect = async (c, parentTask, originTask) => {
    logTask('taskRnvWorkspaceConnect', `parent:${parentTask} origin:${originTask}`);

    const opts = Object.keys(c.files.rnv.configWorkspaces?.workspaces).map(
        v => `${v} ${getWorkspaceConnectionString(
                c.files.rnv.configWorkspaces?.workspaces[v]
        )}`
    );

    const { selectedWS } = await inquirerPrompt({
        type: 'list',
        name: 'selectedWS',
        message: 'Pick a workspace',
        choices: opts
    });

    logRaw(selectedWS);
};

export default {
    description: '',
    fn: taskRnvWorkspaceConnect,
    task: 'workspace connect',
    params: [],
    platforms: [],
    skipPlatforms: true,
};
