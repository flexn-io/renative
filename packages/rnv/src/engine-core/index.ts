import { generateEngineTasks } from '../core/engineManager';

import taskRnvCryptoDecrypt from './tasks/task.rnv.crypto.decrypt';
import taskRnvCryptoEncrypt from './tasks/task.rnv.crypto.encrypt';
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
import rnvFastlane from './tasks/task.rnv.fastlane';
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
import taskRnvAppCreate from './tasks/task.rnv.app.create';
import taskRnvWorkspaceConfigure from './tasks/task.rnv.workspace.configure';
import taskRnvConfigureSoft from './tasks/task.rnv.configureSoft';
import taskRvnKill from './tasks/task.rnv.kill';
import taskRvnDoctor from './tasks/task.rnv.doctor';
import taskRnvTargetList from './tasks/task.rnv.target.list';
import taskRnvTargetLaunch from './tasks/task.rnv.target.launch';
import taskRnvLink from './tasks/task.rnv.link';
import taskRnvUnlink from './tasks/task.rnv.unlink';
import { RnvEngine } from '../core/engineManager/types';

const engine: RnvEngine = {
    initializeRuntimeConfig: () => {
        //Do nothing
    },
    runtimeExtraProps: {},
    serverDirName: '',
    tasks: generateEngineTasks([
        taskRnvCryptoDecrypt,
        taskRnvCryptoEncrypt,
        taskRnvPlatformEject,
        taskRnvPlatformConnect,
        taskRnvPlatformList,
        taskRnvPlatformConfigure,
        taskRnvPlatformSetup,
        taskRnvTemplateAdd,
        taskRnvTemplateApply,
        taskRnvTemplateList,
        taskRnvPluginAdd,
        taskRnvPluginList,
        taskRnvPluginUpdate,
        taskRnvWorkspaceList,
        taskRnvWorkspaceAdd,
        taskRnvWorkspaceConnect,
        taskRnvWorkspaceUpdate,
        taskRnvHooksList,
        taskRnvHooksRun,
        taskRnvHooksPipes,
        taskRnvClean,
        rnvFastlane,
        taskRnvPublish,
        taskRnvPkg,
        taskRnvStatus,
        taskRnvConfig,
        taskRnvHelp,
        taskRnvNew,
        taskRnvInstall,
        taskRnvProjectConfigure,
        taskRnvProjectUpgrade,
        taskRnvAppConfigure,
        taskRnvAppCreate,
        taskRnvWorkspaceConfigure,
        taskRnvConfigureSoft,
        taskRvnKill,
        taskRvnDoctor,
        taskRnvTargetList,
        taskRnvTargetLaunch,
        taskRnvLink,
        taskRnvUnlink,
    ]),
    config: {
        title: 'Engine Core',
        id: 'engine-core',
        platforms: {},
        npm: {},
    },
    // package: '',
    projectDirName: '',
    // ejectPlatform: null,
    platforms: {},
};

export default engine;
