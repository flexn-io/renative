/* eslint-disable import/no-cycle */
import taskRnvRun from './task.rnv.run';
import taskRnvPackage from './task.rnv.package';
import taskRnvBuild from './task.rnv.build';
import taskRnvConfigure from './task.rnv.configure';
import taskRnvStart from './task.rnv.start';
import taskRnvExport from './task.rnv.export';
import taskRnvDeploy from './task.rnv.deploy';
import taskRnvDebug from './task.rnv.debug';
import taskRnvLog from './task.rnv.log';

const TASKS = {};

const addTask = (taskInstance) => {
    TASKS[taskInstance.task] = taskInstance;
};

addTask(taskRnvRun);
addTask(taskRnvPackage);
addTask(taskRnvBuild);
addTask(taskRnvConfigure);
addTask(taskRnvStart);
addTask(taskRnvExport);
addTask(taskRnvDeploy);
addTask(taskRnvDebug);
addTask(taskRnvLog);

const executeTask = async (c, task, parentTask, originTask) => TASKS[task].fn(c, parentTask, originTask);

const hasTask = task => !!TASKS[task];

const getTask = task => TASKS[task];

const getSubTasks = task => Object.values(TASKS).filter(v => v.task.startsWith(task)).map(v => v.task.replace(task, '').trim());

const getTasks = () => Object.values(TASKS);

export default {
    executeTask,
    addTask,
    hasTask,
    getTask,
    getSubTasks,
    getTasks,
};
