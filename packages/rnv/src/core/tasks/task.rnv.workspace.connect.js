/* eslint-disable import/no-cycle */

import { inquirerPrompt } from '../../cli/prompt';
import {
    logTask,
    logRaw
} from '../systemManager/logger';
import { getWorkspaceConnectionString } from '../projectManager/workspace';


export const rnvWorkspaceConnect = async (c) => {
    logTask('rnvWorkspaceConnect');

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
