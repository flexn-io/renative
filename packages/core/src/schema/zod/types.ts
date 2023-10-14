import type { _RootAppSchemaType } from './configFiles/appConfig';
import { _ConfigRootEngineType } from './configFiles/engine';
import { _ConfigRootPlugin } from './configFiles/plugin';
import type { _RootProjectSchemaType } from './configFiles/project';
// import { _ConfigRootTemplates } from './configRootTemplates';

export type ConfigRootProject = _RootProjectSchemaType;
export type ConfigRootApp = _RootAppSchemaType;
export type ConfigRootEngine = _ConfigRootEngineType;
export type ConfigRootPlugin = _ConfigRootPlugin;
// export type ConfigRootTemplates = _ConfigRootTemplates;
