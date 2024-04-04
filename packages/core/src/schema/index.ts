import * as _shared from './shared';
import * as _common from './common';
import * as _plugins from './plugins';
import * as _base from './plugins/fragments/base';
import * as _pAndroid from './plugins/fragments/platformAndroid';
import * as _pIos from './plugins/fragments/platformIos';
import * as _pBase from './plugins/fragments/platformBase';
import * as _platforms from './platforms';
import * as _platformsFragmentsAndroid from './platforms/fragments/android';
import * as _platformsFragmentsIos from './platforms/fragments/ios';
import * as _platformsFragmentsBase from './platforms/fragments/base';
import * as _platformsFragmentsLightning from './platforms/fragments/lightning';
import * as _platformsFragmentsNextJs from './platforms/fragments/nextjs';
import * as _platformsFragmentsWeb from './platforms/fragments/web';
import * as _platformsFragmentsTizen from './platforms/fragments/tizen';
import * as _platformsFragmentsReactNative from './platforms/fragments/reactNative';
import * as _platformsFragmentsWindows from './platforms/fragments/windows';
import * as _platformsFragmentsTemplateAndroid from './platforms/fragments/templateAndroid';
import * as _platformsFragmentsTemplateXcode from './platforms/fragments/templateXcode';
import * as _platformsFragmentsElectron from './platforms/fragments/electron';
import * as _platformsFragmentsWebos from './platforms/fragments/webos';
import * as _app from './configFiles/app';
import * as _engine from './configFiles/engine';
import * as _integration from './configFiles/integration';
import * as _local from './configFiles/local';
import * as _overrides from './configFiles/overrides';
import * as _plugin from './configFiles/plugin';
import * as _private from './configFiles/private';
import * as _project from './configFiles/project';
import * as _root from './configFiles/root';
import * as _runtime from './configFiles/runtime';
import * as _template from './configFiles/template';
import * as _templates from './configFiles/templates';
import * as _workspace from './configFiles/workspace';
import * as _workspaces from './configFiles/workspaces';

export const ZodFileSchema = {
    zodConfigFileApp: _app.zodConfigFileApp,
    zodConfigFileEngine: _engine.zodConfigFileEngine,
    zodConfigFileIntegration: _integration.zodConfigFileIntegration,
    zodConfigFileLocal: _local.zodConfigFileLocal,
    zodConfigFileOverrides: _overrides.zodConfigFileOverrides,
    zodConfigFilePlugin: _plugin.zodConfigFilePlugin,
    zodConfigFilePrivate: _private.zodConfigFilePrivate,
    zodConfigFileProject: _project.zodConfigFileProject,
    zodConfigFileRoot: _root.zodConfigFileRoot,
    zodConfigFileRuntime: _runtime.zodConfigFileRuntime,
    zodConfigFileTemplate: _template.zodConfigFileTemplate,
    zodConfigFileTemplates: _templates.zodConfigFileTemplates,
    zodConfigFileWorkspace: _workspace.zodConfigFileWorkspace,
    zodConfigFileWorkspaces: _workspaces.zodConfigFileWorkspaces,
};

export const ZodSharedSchema = {
    _shared,
    _common,
    _plugins,
    _base,
    _pAndroid,
    _pIos,
    _pBase,
    _platforms,
    _platformsFragmentsAndroid,
    _platformsFragmentsIos,
    _platformsFragmentsBase,
    _platformsFragmentsLightning,
    _platformsFragmentsNextJs,
    _platformsFragmentsWeb,
    _platformsFragmentsTizen,
    _platformsFragmentsReactNative,
    _platformsFragmentsWindows,
    _platformsFragmentsTemplateAndroid,
    _platformsFragmentsTemplateXcode,
    _platformsFragmentsElectron,
    _platformsFragmentsWebos,
};
