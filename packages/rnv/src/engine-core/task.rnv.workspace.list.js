/* eslint-disable import/no-cycle */

import { generateOptions } from '../cli/prompt';
import {
    chalk,
    logTask,
    logToSummary,
} from '../core/systemManager/logger';


export const taskRnvWorkspaceList = async (c, parentTask, originTask) => {
    logTask('taskRnvWorkspaceList', `parent:${parentTask} origin:${originTask}`);

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

export default {
    description: '',
    fn: taskRnvWorkspaceList,
    task: 'workspace list',
    params: [],
    platforms: [],
};
