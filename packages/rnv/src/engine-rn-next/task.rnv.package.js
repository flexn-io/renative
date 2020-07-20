/* eslint-disable import/no-cycle */
import { logTask } from '../core/systemManager/logger';
import {
    TASK_PACKAGE,
    TASK_CONFIGURE
} from '../core/constants';
import { executeTask } from '../core/engineManager';

export const taskRnvPackage = async (c, parentTask, originTask) => {
    logTask('taskRnvPackage', `parent:${parentTask}`);

    await executeTask(c, TASK_CONFIGURE, TASK_PACKAGE, originTask);

    return true;
};

export default {
    description: '',
    fn: taskRnvPackage,
    task: 'package',
    subTask: null,
    params: [],
    platforms: [],
};
