import { RnvRootAppSchema } from './app';
import { RnvRootEngineSchema } from './engine';
import { _RootWorkspaceSchemaType } from './workspace';
import { RnvRootIntegrationSchema } from './integration';
import { _RootLocalSchemaType } from './local';
import { _RootPluginSchemaType } from './plugin';
import { _RootPrivateSchemaType } from './private';
import { RnvRootProjectSchema } from './project';
import { _RootTemplatesSchemaType } from './templates';
import { RnvRootWorkspacesSchema } from './workspaces';
import { _RootRuntimeSchemaType } from './runtime';
import { RnvRootOverridesSchema } from './overrides';
import { RnvRootTemplateSchema } from './template';

// renative.json
export type ConfigFileProject = RnvRootProjectSchema;

// appConfigs/**/renative.json
export type ConfigFileApp = RnvRootAppSchema;

// renative.engine.json
export type ConfigFileEngine = RnvRootEngineSchema;

// renative.plugin.json
export type ConfigFilePlugin = _RootPluginSchemaType;

// renative.local.json
export type ConfigFileLocal = _RootLocalSchemaType;

// renative.private.json
export type ConfigFilePrivate = _RootPrivateSchemaType;

// renative.template.json
export type ConfigFileTemplate = RnvRootTemplateSchema;

// renative.templates.json
export type ConfigFileTemplates = _RootTemplatesSchemaType;

// renative.workspace.json
export type ConfigFileWorkspace = _RootWorkspaceSchemaType;

// renative.workspaces.json
export type ConfigFileWorkspaces = RnvRootWorkspacesSchema;

// renative.integration.json
export type ConfigFileIntegration = RnvRootIntegrationSchema;

// renative.runtime.json
export type ConfigFileRuntime = _RootRuntimeSchemaType;

//overrides.json
export type ConfigFileOverrides = RnvRootOverridesSchema;
