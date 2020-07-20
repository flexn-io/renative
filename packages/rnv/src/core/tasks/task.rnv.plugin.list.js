/* eslint-disable import/no-cycle */
import {
    logTask,
    logToSummary,
} from '../systemManager/logger';

import { getPluginList } from '../pluginManager';

export const taskRnvPluginList = c => new Promise((resolve) => {
    logTask('_runList');

    const o = getPluginList(c);

    // console.log(o.asString);
    logToSummary(`Plugins:\n\n${o.asString}`);

    resolve();
});
