import { TaskManager, EngineManager } from 'rnv';
import { PLATFORMS, CONFIG } from './constants';
import { getPlatformBuildDir, getPlatformProjectDir, getPlatformOutputDir,
    getTemplateProjectDir, ejectPlatform, getTemplateRootDir, getOriginalPlatformTemplatesDir } from './commonEngine';

import taskRnvRun from './tasks/task.rnv.run';
import taskRnvConfigure from './tasks/task.rnv.configure';

const { getEngineTask, hasEngineTask, getEngineSubTasks } = EngineManager;
const { executeEngineTask } = TaskManager;

const TASKS = {};

const addTask = (taskInstance) => {
    TASKS[taskInstance.task] = taskInstance;
};

addTask(taskRnvRun);
addTask(taskRnvConfigure);

const executeTask = (c, task, parentTask, originTask, isFirstTask) => executeEngineTask(
    c, task, parentTask, originTask, TASKS, isFirstTask
);

const hasTask = (task, isProjectScope) => hasEngineTask(task, TASKS, isProjectScope);

const getTask = task => getEngineTask(task, TASKS);

const getSubTasks = (task, exactMatch) => getEngineSubTasks(task, TASKS, exactMatch);

const getTasks = () => Object.values(TASKS);

const getId = () => CONFIG.id;

const { title } = CONFIG;

export default {
    getPlatformBuildDir,
    getPlatformProjectDir,
    getPlatformOutputDir,
    ejectPlatform,
    getTemplateProjectDir,
    getTemplateRootDir,
    getOriginalPlatformTemplatesDir,
    executeTask,
    addTask,
    hasTask,
    getTask,
    getSubTasks,
    getTasks,
    getId,
    title,
    config: CONFIG,
    PLATFORMS
};
