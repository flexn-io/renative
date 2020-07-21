/* eslint-disable import/no-cycle */
import {
    logToSummary,
    logTask,
} from '../core/systemManager/logger';

import { getTemplateOptions } from '../core/templateManager';


export const taskRnvTemplateList = (c, parentTask, originTask) => new Promise((resolve) => {
    logTask('taskRnvTemplateList', `parent:${parentTask} origin:${originTask}`);
    const opts = getTemplateOptions(c);
    logToSummary(`Templates:\n\n${opts.asString}`);
    resolve();
});

export default {
    description: '',
    fn: taskRnvTemplateList,
    task: 'template list',
    params: [],
    platforms: [],
};
