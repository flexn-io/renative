import { RnvEngine, generateEngineTasks } from '@rnv/core';

import taskRnvCryptoDecrypt from './tasks/crypto/taskCryptoDecrypt';
import taskRnvCryptoEncrypt from './tasks/crypto/taskCryptoEncrypt';
import taskRnvPlatformEject from './tasks/platform/task.rnv.platform.eject';
import taskRnvPlatformConnect from './tasks/platform/task.rnv.platform.connect';
import taskRnvPlatformList from './tasks/platform/task.rnv.platform.list';
import taskRnvPlatformConfigure from './tasks/platform/task.rnv.platform.configure';
import taskRnvPlatformSetup from './tasks/platform/task.rnv.platform.setup';
import taskRnvTemplateAdd from './tasks/template/task.rnv.template.add';
import taskRnvTemplateApply from './tasks/template/task.rnv.template.apply';
import taskRnvTemplateList from './tasks/template/task.rnv.template.list';
import taskRnvPluginAdd from './tasks/plugin/task.rnv.plugin.add';
import taskRnvPluginList from './tasks/plugin/task.rnv.plugin.list';
import taskRnvPluginUpdate from './tasks/plugin/task.rnv.plugin.update';
import taskRnvWorkspaceList from './tasks/workspace/taskWorkspaceList';
import taskRnvWorkspaceAdd from './tasks/workspace/taskWorkspaceAdd';
import taskRnvWorkspaceConnect from './tasks/workspace/taskWorkspaceConnect';
import taskRnvWorkspaceUpdate from './tasks/workspace/taskWorkspaceUpdate';
import taskRnvHooksList from './tasks/hooks/taskHooksList';
import taskRnvHooksRun from './tasks/hooks/taskHooksRun';
import taskRnvHooksPipes from './tasks/hooks/taskHooksPipes';
import taskRnvClean from './tasks/global/task.rnv.clean';
import taskRnvStatus from './tasks/global/task.rnv.status';
import taskRnvConfig from './tasks/global/task.rnv.config';
import taskRnvHelp from './tasks/global/task.rnv.help';
import taskRnvNew from './tasks/global/task.rnv.new';
import taskRnvInstall from './tasks/global/task.rnv.install';
import taskRnvProjectConfigure from './tasks/project/taskProjectConfigure';
import taskRnvProjectUpgrade from './tasks/project/taskProjectUpgrade';
import taskRnvAppConfigure from './tasks/app/taskAppConfigure';
import taskRnvAppCreate from './tasks/app/taskAppCreate';
import taskRnvWorkspaceConfigure from './tasks/workspace/taskWorkspaceConfigure';
import taskRnvConfigureSoft from './tasks/global/task.rnv.configureSoft';
import taskRvnKill from './tasks/global/task.rnv.kill';
import taskRvnDoctor from './tasks/global/task.rnv.doctor';
import taskRnvTargetList from './tasks/target/taskTargetList';
import taskRnvTargetLaunch from './tasks/target/taskTargetLaunch';
import taskRnvLink from './tasks/linking/taskLink';
import taskRnvUnlink from './tasks/linking/taskUnlink';
import taskRnvTelemetryStatus from './tasks/telemetry/taskTelemetryStatus';
import taskRnvTelemetryEnable from './tasks/telemetry/taskTelemetryEnable';
import taskRnvTelemetryDisable from './tasks/telemetry/taskTelemetryDisable';
import taskRnvSwitch from './tasks/app/taskAppSwitch';

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
