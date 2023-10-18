import { _RootAppSchemaType } from './app';
import { _ConfigRootEngineType } from './engine';
import { _RootGlobalSchemaType } from './global';
import { _RootIntegrationSchemaType } from './integration';
import { _RootLocalSchemaType } from './local';
import { _RootPluginSchemaType } from './plugin';
import { _RootPluginsSchemaType } from './plugins';
import { _RootPrivateSchemaType } from './private';
import { _RootProjectSchemaType } from './project';
import { _RootTemplateSchemaType } from './template';
import { _RootTemplatesSchemaType } from './templates';

// renative.json
export type ConfigFileProject = _RootProjectSchemaType;

// appConfigs/**/renative.json
export type ConfigFileApp = _RootAppSchemaType;

// renative.engine.json
export type ConfigFileEngine = _ConfigRootEngineType;

// renative.plugin.json
export type ConfigFilePlugin = _RootPluginSchemaType;

// renative.plugins.json
export type ConfigFilePlugins = _RootPluginsSchemaType;

// renative.local.json
export type ConfigFileLocal = _RootLocalSchemaType;

// renative.private.json
export type ConfigFilePrivate = _RootPrivateSchemaType;

// renative.template.json
export type ConfigFileTemplate = _RootTemplateSchemaType;

// renative.templates.json
export type ConfigFileTemplates = _RootTemplatesSchemaType;

// renative.workspace.json
export type ConfigFileWorkspaces = _RootGlobalSchemaType;

// renative.integration.json
export type ConfigFileIntegration = _RootIntegrationSchemaType;
