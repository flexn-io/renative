import { RnvEngine, generateEngineTasks } from '@rnv/core';

import taskRnvCryptoDecrypt from './tasks/crypto/taskCryptoDecrypt';
import taskRnvCryptoEncrypt from './tasks/crypto/taskCryptoEncrypt';
import taskRnvPlatformEject from './tasks/platform/taskPlatformEject';
import taskRnvPlatformConnect from './tasks/platform/taskPlatformConnect';
import taskRnvPlatformList from './tasks/platform/taskPlatformList';
import taskRnvPlatformConfigure from './tasks/platform/taskPlatformConfigure';
import taskRnvPlatformSetup from './tasks/platform/taskPlatformSetup';
import taskRnvTemplateAdd from './tasks/template/taskTemplateAdd';
import taskRnvTemplateApply from './tasks/template/taskTemplateApply';
import taskRnvTemplateList from './tasks/template/taskTemplateList';
import taskRnvPluginAdd from './tasks/plugin/taskPluginAdd';
import taskRnvPluginList from './tasks/plugin/taskPluginList';
import taskRnvPluginUpdate from './tasks/plugin/taskPluginUpdate';
import taskRnvWorkspaceList from './tasks/workspace/taskWorkspaceList';
import taskRnvWorkspaceAdd from './tasks/workspace/taskWorkspaceAdd';
import taskRnvWorkspaceConnect from './tasks/workspace/taskWorkspaceConnect';
import taskRnvWorkspaceUpdate from './tasks/workspace/taskWorkspaceUpdate';
import taskRnvHooksList from './tasks/hooks/taskHooksList';
import taskRnvHooksRun from './tasks/hooks/taskHooksRun';
import taskRnvHooksPipes from './tasks/hooks/taskHooksPipes';
import taskRnvClean from './tasks/global/taskClean';
import taskRnvStatus from './tasks/global/taskStatus';
import taskRnvConfig from './tasks/global/taskConfig';
import taskRnvHelp from './tasks/global/taskHelp';
import taskRnvNew from './tasks/global/taskNew';
import taskRnvInstall from './tasks/global/taskInstall';
import taskRnvProjectConfigure from './tasks/project/taskProjectConfigure';
import taskRnvProjectUpgrade from './tasks/project/taskProjectUpgrade';
import taskRnvAppConfigure from './tasks/app/taskAppConfigure';
import taskRnvAppCreate from './tasks/app/taskAppCreate';
import taskRnvWorkspaceConfigure from './tasks/workspace/taskWorkspaceConfigure';
import taskRnvConfigureSoft from './tasks/global/taskConfigureSoft';
import taskRvnKill from './tasks/global/taskKill';
import taskRvnDoctor from './tasks/global/taskDoctor';
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
