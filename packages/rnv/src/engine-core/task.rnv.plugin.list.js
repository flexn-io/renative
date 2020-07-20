/* eslint-disable import/no-cycle */
import {
    logTask,
    logToSummary,
} from '../core/systemManager/logger';

import { getPluginList } from '../core/pluginManager';

export const taskRnvPluginList = (c, parentTask, originTask) => new Promise((resolve) => {
    logTask('taskRnvPluginList', `parent:${parentTask} origin:${originTask}`);

    const o = getPluginList(c);

    // console.log(o.asString);
    logToSummary(`Plugins:\n\n${o.asString}`);

    resolve();
});

export default {
    description: '',
    fn: taskRnvPluginList,
    task: 'plugin',
    subTask: 'list',
    params: [],
    platforms: [],
};
