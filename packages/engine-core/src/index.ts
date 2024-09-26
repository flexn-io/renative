import { createRnvEngine, ConfigFileEngine, GetContextType } from '@rnv/core';

import taskCryptoDecrypt from './tasks/crypto/taskCryptoDecrypt';
import taskCryptoEncrypt from './tasks/crypto/taskCryptoEncrypt';
import taskPlatformEject from './tasks/platform/taskPlatformEject';
import taskPlatformConnect from './tasks/platform/taskPlatformConnect';
import taskPlatformList from './tasks/platform/taskPlatformList';
import taskPlatformConfigure from './tasks/platform/taskPlatformConfigure';
import taskPlatformSetup from './tasks/project/taskProjectPlatforms';
import taskTemplateApply from './tasks/template/taskTemplateApply';
import taskPluginAdd from './tasks/plugin/taskPluginAdd';
import taskPluginList from './tasks/plugin/taskPluginList';
import taskPluginUpdate from './tasks/plugin/taskPluginUpdate';
import taskWorkspaceList from './tasks/workspace/taskWorkspaceList';
import taskWorkspaceAdd from './tasks/workspace/taskWorkspaceAdd';
import taskWorkspaceConnect from './tasks/workspace/taskWorkspaceConnect';
import taskHooksList from './tasks/hooks/taskHooksList';
import taskHooksRun from './tasks/hooks/taskHooksRun';
import taskHooksPipes from './tasks/hooks/taskHooksPipes';
import taskClean from './tasks/global/taskClean';
import taskInfo from './tasks/global/taskInfo';
import taskConfig from './tasks/global/taskConfig';
import taskHelp from './tasks/global/taskHelp';
import taskNew from './tasks/bootstrap/taskNew';
import taskProjectConfigure from './tasks/project/taskProjectConfigure';
import taskProjectUpgrade from './tasks/project/taskProjectUpgrade';
import taskAppConfigure from './tasks/app/taskAppConfigure';
import taskAppCreate from './tasks/app/taskAppCreate';
import taskWorkspaceConfigure from './tasks/workspace/taskWorkspaceConfigure';
import taskConfigureSoft from './tasks/project/taskConfigureSoft';
import taskRvnKill from './tasks/global/taskKill';
import taskRvnDoctor from './tasks/global/taskDoctor';
import taskLink from './tasks/linking/taskLink';
import taskUnlink from './tasks/linking/taskUnlink';

import taskSwitch from './tasks/app/taskAppSwitch';
import taskPatchReset from './tasks/patch/taskPatchReset';
const Config: ConfigFileEngine = {
    platforms: {},
    npm: {},
    engineExtension: 'core',
    name: '@rnv/engine-core',
};

const Engine = createRnvEngine({
    serverDirName: '',
    tasks: [
        taskCryptoDecrypt,
        taskCryptoEncrypt,
        taskPlatformEject,
        taskPlatformConnect,
        taskPlatformList,
        taskPlatformConfigure,
        taskPlatformSetup,
        taskTemplateApply,
        taskPluginAdd,
        taskPluginList,
        taskPluginUpdate,
        taskWorkspaceList,
        taskWorkspaceAdd,
        taskWorkspaceConnect,
        taskHooksList,
        taskHooksRun,
        taskHooksPipes,
        taskClean,
        taskInfo,
        taskConfig,
        taskHelp,
        taskNew,
        taskProjectConfigure,
        taskProjectUpgrade,
        taskAppConfigure,
        taskAppCreate,
        taskWorkspaceConfigure,
        taskConfigureSoft,
        taskRvnKill,
        taskRvnDoctor,
        taskLink,
        taskUnlink,
        taskSwitch,
        taskPatchReset,
    ],
    config: Config,
    projectDirName: '',
    platforms: {},
    rootPath: __dirname,
});

// export newly decorated type for getContext proxy with decorated types
export type GetContext = GetContextType<typeof Engine.getContext>;

export default Engine;
