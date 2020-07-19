/* eslint-disable import/no-cycle */
import {
    logToSummary,
    logTask,
} from '../systemManager/logger';

import { getTemplateOptions } from '../templateManager';


export const rnvTemplateList = c => new Promise((resolve) => {
    logTask('rnvTemplateList');
    const opts = getTemplateOptions(c);
    logToSummary(`Templates:\n\n${opts.asString}`);
    resolve();
});
