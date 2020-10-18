import { getEngineTask, hasEngineTask, getEngineSubTasks, executeEngineTask } from '../core/engineManager';
import { getPlatformBuildDir, getPlatformProjectDir, getPlatformOutputDir,
    getTemplateProjectDir, ejectPlatform, getTemplateRootDir } from './commonEngine';

// import taskRnvLink from './tasks/task.rnv.link';
// import taskRnvSwitch from './tasks/task.rnv.switch';
import taskRnvCryptoDecrypt from './tasks/task.rnv.crypto.decrypt';
import taskRnvCryptoEncrypt from './tasks/task.rnv.crypto.encrypt';
import taskRnvCryptoInstallCerts from './tasks/task.rnv.crypto.installCerts';
import taskRnvCryptoUpdateProfile from './tasks/task.rnv.crypto.updateProfile';
import taskRnvCryptoUpdateProfiles from './tasks/task.rnv.crypto.updateProfiles';
import taskRnvCryptoInstallProfiles from './tasks/task.rnv.crypto.installProfiles';
import taskRnvTargetList from './tasks/task.rnv.target.list';
import taskRnvTargetLaunch from './tasks/task.rnv.target.launch';
import taskRnvPlatformEject from './tasks/task.rnv.platform.eject';
import taskRnvPlatformConnect from './tasks/task.rnv.platform.connect';
import taskRnvPlatformList from './tasks/task.rnv.platform.list';
import taskRnvPlatformConfigure from './tasks/task.rnv.platform.configure';
import taskRnvPlatformSetup from './tasks/task.rnv.platform.setup';
import taskRnvTemplateAdd from './tasks/task.rnv.template.add';
import taskRnvTemplateApply from './tasks/task.rnv.template.apply';
import taskRnvTemplateList from './tasks/task.rnv.template.list';
import taskRnvPluginAdd from './tasks/task.rnv.plugin.add';
import taskRnvPluginList from './tasks/task.rnv.plugin.list';
import taskRnvPluginUpdate from './tasks/task.rnv.plugin.update';
import taskRnvWorkspaceList from './tasks/task.rnv.workspace.list';
import taskRnvWorkspaceAdd from './tasks/task.rnv.workspace.add';
import taskRnvWorkspaceConnect from './tasks/task.rnv.workspace.connect';
import taskRnvWorkspaceUpdate from './tasks/task.rnv.workspace.update';
import taskRnvHooksList from './tasks/task.rnv.hooks.list';
import taskRnvHooksRun from './tasks/task.rnv.hooks.run';
import taskRnvHooksPipes from './tasks/task.rnv.hooks.pipes';
import taskRnvClean from './tasks/task.rnv.clean';
import rnvFastlane from '../integration-fastlane/task.rnv.fastlane';
import taskRnvPublish from './tasks/task.rnv.publish';
import taskRnvPkg from './tasks/task.rnv.pkg';
import taskRnvStatus from './tasks/task.rnv.status';
import taskRnvConfig from './tasks/task.rnv.config';
import taskRnvHelp from './tasks/task.rnv.help';
import taskRnvNew from './tasks/task.rnv.new';
import taskRnvInstall from './tasks/task.rnv.install';
import taskRnvProjectConfigure from './tasks/task.rnv.project.configure';
import taskRnvProjectUpgrade from './tasks/task.rnv.project.upgrade';
import taskRnvAppConfigure from './tasks/task.rnv.app.configure';
import taskRnvWorkspaceConfigure from './tasks/task.rnv.workspace.configure';
import taskRnvLog from './tasks/task.rnv.log';
import taskRnvConfigureSoft from './tasks/task.rnv.configureSoft';
import taskRvnKill from './tasks/task.rnv.kill';
import taskRvnDoctor from './tasks/task.rnv.doctor';

const TASKS = {};

const addTask = (taskInstance) => {
    if (!taskInstance?.task) {
        throw new Error('taskInstance has missing task name!');
    }
    TASKS[taskInstance.task] = taskInstance;
};

// addTask(taskRnvLink);
// addTask(taskRnvSwitch);
addTask(taskRnvCryptoDecrypt);
addTask(taskRnvCryptoEncrypt);
addTask(taskRnvCryptoInstallCerts);
addTask(taskRnvCryptoUpdateProfile);
addTask(taskRnvCryptoUpdateProfiles);
addTask(taskRnvCryptoInstallProfiles);
addTask(taskRnvTargetList);
addTask(taskRnvTargetLaunch);
addTask(taskRnvPlatformEject);
addTask(taskRnvPlatformConnect);
addTask(taskRnvPlatformList);
addTask(taskRnvPlatformConfigure);
addTask(taskRnvPlatformSetup);
addTask(taskRnvTemplateAdd);
addTask(taskRnvTemplateApply);
addTask(taskRnvTemplateList);
addTask(taskRnvPluginAdd);
addTask(taskRnvPluginList);
addTask(taskRnvPluginUpdate);
addTask(taskRnvWorkspaceList);
addTask(taskRnvWorkspaceAdd);
addTask(taskRnvWorkspaceConnect);
addTask(taskRnvWorkspaceUpdate);
addTask(taskRnvHooksList);
addTask(taskRnvHooksRun);
addTask(taskRnvHooksPipes);
addTask(taskRnvClean);
addTask(rnvFastlane);
addTask(taskRnvPublish);
addTask(taskRnvPkg);
addTask(taskRnvStatus);
addTask(taskRnvConfig);
addTask(taskRnvHelp);
addTask(taskRnvNew);
addTask(taskRnvInstall);
addTask(taskRnvProjectConfigure);
addTask(taskRnvProjectUpgrade);
addTask(taskRnvAppConfigure);
addTask(taskRnvWorkspaceConfigure);
addTask(taskRnvLog);
addTask(taskRnvConfigureSoft);
addTask(taskRvnKill);
addTask(taskRvnDoctor);

const executeTask = (c, task, parentTask, originTask, isFirstTask) => executeEngineTask(
    c, task, parentTask, originTask, TASKS, isFirstTask
);

const hasTask = (task, isProjectScope) => hasEngineTask(task, TASKS, isProjectScope);

const getTask = task => getEngineTask(task, TASKS);

const getSubTasks = (task, exactMatch) => getEngineSubTasks(task, TASKS, exactMatch);

const getTasks = () => Object.values(TASKS);

const getId = () => 'engine-core';

const title = 'Engine Core';

export default {
    getPlatformBuildDir,
    getPlatformProjectDir,
    getPlatformOutputDir,
    ejectPlatform,
    getTemplateProjectDir,
    getTemplateRootDir,
    executeTask,
    addTask,
    hasTask,
    getTask,
    getSubTasks,
    getTasks,
    getId,
    title
};
