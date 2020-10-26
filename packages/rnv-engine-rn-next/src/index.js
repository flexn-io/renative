import path from 'path';
import { TaskManager, EngineManager } from 'rnv';
import { withRNV } from './adapter';
import { getPlatformBuildDir, getPlatformProjectDir, getPlatformOutputDir,
    getTemplateProjectDir, ejectPlatform, getTemplateRootDir, getOriginalPlatformTemplatesDir } from './commonEngine';

import taskRnvRun from './tasks/task.rnv.run';
import taskRnvPackage from './tasks/task.rnv.package';
import taskRnvBuild from './tasks/task.rnv.build';
import taskRnvConfigure from './tasks/task.rnv.configure';
import taskRnvStart from './tasks/task.rnv.start';
import taskRnvExport from './tasks/task.rnv.export';
import taskRnvDeploy from './tasks/task.rnv.deploy';
import taskRnvDebug from './tasks/task.rnv.debug';
import config from '../renative.engine.json';

const { getEngineTask, hasEngineTask, getEngineSubTasks } = EngineManager;
const { executeEngineTask } = TaskManager;

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

const executeTask = (c, task, parentTask, originTask, isFirstTask) => executeEngineTask(
    c, task, parentTask, originTask, TASKS, isFirstTask
);

const hasTask = (task, isProjectScope) => hasEngineTask(task, TASKS, isProjectScope);

const getTask = task => getEngineTask(task, TASKS);

const getSubTasks = (task, exactMatch) => getEngineSubTasks(task, TASKS, exactMatch);

const getTasks = () => Object.values(TASKS);

const getId = () => 'engine-rn-next';

const title = 'Engine RN Next';

const getOriginalAssetsDir = () => path.join(__dirname, '../projectTemplate/assets');

export default {
    getPlatformBuildDir,
    getPlatformProjectDir,
    getPlatformOutputDir,
    ejectPlatform,
    getTemplateProjectDir,
    getTemplateRootDir,
    getOriginalPlatformTemplatesDir,
    getOriginalAssetsDir,
    executeTask,
    addTask,
    hasTask,
    getTask,
    getSubTasks,
    getTasks,
    getId,
    title,
    config
};

export { withRNV };
