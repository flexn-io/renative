import { RnvEngine, generateEngineTasks } from '@rnv/core';

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
import taskRnvTelemetryStatus from './tasks/task.rnv.telemetry.status';
import taskRnvTelemetryEnable from './tasks/task.rnv.telemetry.enable';
import taskRnvTelemetryDisable from './tasks/task.rnv.telemetry.disable';
import taskRnvSwitch from './tasks/task.rnv.switch';

const Engine: RnvEngine = {
    // initializeRuntimeConfig: () => {
    //     //Do nothing
    // },
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
        taskRnvTelemetryStatus,
        taskRnvTelemetryEnable,
        taskRnvTelemetryDisable,
        taskRnvSwitch,
    ]),
    config: {
        // title: 'Engine Core',
        id: 'engine-core',
        platforms: {},
        npm: {},
        engineExtension: 'core',
        overview: '',
    },
    // package: '',
    projectDirName: '',
    // ejectPlatform: null,
    platforms: {},
    rootPath: __dirname,
};

export default Engine;
