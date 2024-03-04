import { RnvEngine, generateEngineTasks } from '@rnv/core';

import taskCryptoDecrypt from './tasks/crypto/taskCryptoDecrypt';
import taskCryptoEncrypt from './tasks/crypto/taskCryptoEncrypt';
import taskPlatformEject from './tasks/platform/taskPlatformEject';
import taskPlatformConnect from './tasks/platform/taskPlatformConnect';
import taskPlatformList from './tasks/platform/taskPlatformList';
import taskPlatformConfigure from './tasks/platform/taskPlatformConfigure';
import taskPlatformSetup from './tasks/platform/taskPlatformSetup';
import taskTemplateAdd from './tasks/template/taskTemplateAdd';
import taskTemplateApply from './tasks/template/taskTemplateApply';
import taskTemplateList from './tasks/template/taskTemplateList';
import taskPluginAdd from './tasks/plugin/taskPluginAdd';
import taskPluginList from './tasks/plugin/taskPluginList';
import taskPluginUpdate from './tasks/plugin/taskPluginUpdate';
import taskWorkspaceList from './tasks/workspace/taskWorkspaceList';
import taskWorkspaceAdd from './tasks/workspace/taskWorkspaceAdd';
import taskWorkspaceConnect from './tasks/workspace/taskWorkspaceConnect';
import taskWorkspaceUpdate from './tasks/workspace/taskWorkspaceUpdate';
import taskHooksList from './tasks/hooks/taskHooksList';
import taskHooksRun from './tasks/hooks/taskHooksRun';
import taskHooksPipes from './tasks/hooks/taskHooksPipes';
import taskClean from './tasks/global/taskClean';
import taskStatus from './tasks/global/taskStatus';
import taskConfig from './tasks/global/taskConfig';
import taskHelp from './tasks/global/taskHelp';
import taskNew from './tasks/global/taskNew';
import taskInstall from './tasks/global/taskInstall';
import taskProjectConfigure from './tasks/project/taskProjectConfigure';
import taskProjectUpgrade from './tasks/project/taskProjectUpgrade';
import taskAppConfigure from './tasks/app/taskAppConfigure';
import taskAppCreate from './tasks/app/taskAppCreate';
import taskWorkspaceConfigure from './tasks/workspace/taskWorkspaceConfigure';
import taskConfigureSoft from './tasks/global/taskConfigureSoft';
import taskRvnKill from './tasks/global/taskKill';
import taskRvnDoctor from './tasks/global/taskDoctor';
import taskTargetList from './tasks/target/taskTargetList';
import taskTargetLaunch from './tasks/target/taskTargetLaunch';
import taskLink from './tasks/linking/taskLink';
import taskUnlink from './tasks/linking/taskUnlink';
import taskTelemetryStatus from './tasks/telemetry/taskTelemetryStatus';
import taskTelemetryEnable from './tasks/telemetry/taskTelemetryEnable';
import taskTelemetryDisable from './tasks/telemetry/taskTelemetryDisable';
import taskSwitch from './tasks/app/taskAppSwitch';

const Engine: RnvEngine = {
    // initializeRuntimeConfig: () => {
    //     //Do nothing
    // },
    runtimeExtraProps: {},
    serverDirName: '',
    tasks: generateEngineTasks([
        taskCryptoDecrypt,
        taskCryptoEncrypt,
        taskPlatformEject,
        taskPlatformConnect,
        taskPlatformList,
        taskPlatformConfigure,
        taskPlatformSetup,
        taskTemplateAdd,
        taskTemplateApply,
        taskTemplateList,
        taskPluginAdd,
        taskPluginList,
        taskPluginUpdate,
        taskWorkspaceList,
        taskWorkspaceAdd,
        taskWorkspaceConnect,
        taskWorkspaceUpdate,
        taskHooksList,
        taskHooksRun,
        taskHooksPipes,
        taskClean,
        taskStatus,
        taskConfig,
        taskHelp,
        taskNew,
        taskInstall,
        taskProjectConfigure,
        taskProjectUpgrade,
        taskAppConfigure,
        taskAppCreate,
        taskWorkspaceConfigure,
        taskConfigureSoft,
        taskRvnKill,
        taskRvnDoctor,
        taskTargetList,
        taskTargetLaunch,
        taskLink,
        taskUnlink,
        taskTelemetryStatus,
        taskTelemetryEnable,
        taskTelemetryDisable,
        taskSwitch,
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
