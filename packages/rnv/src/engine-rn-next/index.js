/* eslint-disable import/no-cycle */
import {
    TASK_RUN, TASK_BUILD, TASK_PACKAGE, TASK_EXPORT, TASK_START, TASK_LOG,
    TASK_DEPLOY, TASK_DEBUG, TASK_CONFIGURE
} from '../core/constants';

import { taskRnvRun } from './task.rnv.run';
import { taskRnvPackage } from './task.rnv.package';
import { taskRnvBuild } from './task.rnv.build';
import { taskRnvConfigure } from './task.rnv.configure';
import { taskRnvStart } from './task.rnv.start';
import { taskRnvExport } from './task.rnv.export';
import { taskRnvDeploy } from './task.rnv.deploy';
import { taskRnvDebug } from './task.rnv.debug';
import { taskRnvLog } from './task.rnv.log';

const TASKS = {};
TASKS[TASK_RUN] = taskRnvRun;
TASKS[TASK_PACKAGE] = taskRnvPackage;
TASKS[TASK_BUILD] = taskRnvBuild;
TASKS[TASK_CONFIGURE] = taskRnvConfigure;
TASKS[TASK_START] = taskRnvStart;
TASKS[TASK_EXPORT] = taskRnvExport;
TASKS[TASK_DEPLOY] = taskRnvDeploy;
TASKS[TASK_DEBUG] = taskRnvDebug;
TASKS[TASK_LOG] = taskRnvLog;

const executeTask = async (c, task, parentTask, originTask) => TASKS[task](c, parentTask, originTask);

const applyTemplate = async () => true;

const hasTask = task => !!TASKS[task];

export default {
    executeTask,
    hasTask,
    applyTemplate
};
