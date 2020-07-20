/* eslint-disable import/no-cycle */
import {
    logToSummary,
    logTask,
} from '../systemManager/logger';

import { getTemplateOptions } from '../templateManager';


export const taskRnvTemplateList = c => new Promise((resolve) => {
    logTask('taskRnvTemplateList');
    const opts = getTemplateOptions(c);
    logToSummary(`Templates:\n\n${opts.asString}`);
    resolve();
});
