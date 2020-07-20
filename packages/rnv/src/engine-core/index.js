/* eslint-disable import/no-cycle */

// import { taskRnvLink } from './task.rnv.link';
// import { taskRnvSwitch } from './task.rnv.switch';
// import { taskRnvCryptoDecrypt } from './task.rnv.crypto.decrypt';
// import { taskRnvCryptoEncrypt } from './task.rnv.crypto.encrypt';
// import { taskRnvCryptoInstallCerts } from './task.rnv.crypto.installCerts';
// import { taskRnvCryptoUpdateProfile } from './task.rnv.crypto.updateProfile';
// import { taskRnvCryptoUpdateProfiles } from './task.rnv.crypto.updateProfiles';
// import { taskRnvCryptoInstallProfiles } from './task.rnv.crypto.installProfiles';
// import { taskRnvTargetList } from './task.rnv.target.list';
// import { taskRnvTargetLaunch } from './task.rnv.target.launch';
// import { taskRnvPlatformEject } from './task.rnv.platform.eject';
// import { taskRnvPlatformConnect } from './task.rnv.platform.connect';
// import { taskRnvPlatformList } from './task.rnv.platform.list';
// import { taskRnvPlatformConfigure } from './task.rnv.platform.configure';
// import { taskRnvPlatformSetup } from './task.rnv.platform.setup';
// import { taskRnvTemplateAdd } from './task.rnv.template.add';
// import { taskRnvTemplateApply } from './task.rnv.template.apply';
// import { taskRnvTemplateList } from './task.rnv.template.list';
// import { taskRnvPluginAdd } from './task.rnv.plugin.add';
// import { taskRnvPluginList } from './task.rnv.plugin.list';
// import { taskRnvPluginUpdate } from './task.rnv.plugin.update';
// import { taskRnvWorkspaceList } from './task.rnv.workspace.list';
// import { taskRnvWorkspaceAdd } from './task.rnv.workspace.add';
// import { taskRnvWorkspaceConnect } from './task.rnv.workspace.connect';
// import { taskRnvWorkspaceUpdate } from './task.rnv.workspace.update';
// import { taskRnvHooksList } from './task.rnv.hooks.list';
// import { taskRnvHooksRun } from './task.rnv.hooks.run';
// import { taskRnvHooksPipes } from './task.rnv.hooks.pipes';
// import { taskRnvClean } from './task.rnv.clean';
// import { rnvFastlane } from '../integration-fastlane/task.rnv.fastlane';
// import { taskRnvPublish } from './task.rnv.publish';
// import { taskRnvPkg } from './task.rnv.pkg';
// import { taskRnvStatus } from './task.rnv.status';
// import { taskRnvConfig } from './task.rnv.config';
// import { taskRnvHelp } from './task.rnv.help';
// import { taskRnvNew } from './task.rnv.new';

const TASKS = {};

const executeTask = async (c, task, parentTask, originTask) => TASKS[task](c, parentTask, originTask);

const applyTemplate = async () => true;

export default {
    executeTask,
    applyTemplate
};
