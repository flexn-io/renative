/* eslint-disable import/no-cycle */

import { generateOptions } from '../../cli/prompt';
import {
    chalk,
    logTask,
    logToSummary,
} from '../systemManager/logger';


export const taskRnvWorkspaceList = async (c) => {
    logTask('taskRnvWorkspaceList');

    const opts = generateOptions(
        c.files.rnv.configWorkspaces?.workspaces,
        true,
        null,
        (i, obj, mapping, defaultVal) => {
            const isConnected = '';
            return ` [${chalk().grey(i + 1)}]> ${chalk().bold(
                defaultVal
            )}${isConnected} \n`;
        }
    );

    logToSummary(`Workspaces:\n\n${opts.asString}`);
};
