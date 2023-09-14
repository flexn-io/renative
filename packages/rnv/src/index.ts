import 'regenerator-runtime/runtime';
import 'source-map-support/register';

import Spinner from './cli/ora';
import CLI from './cli';
import Config from './core/contextManager/context';
import { run } from './runner';

export * from './modules';
export * from './core/adapter';

export * from './core/engineManager';
export * from './core/setupManager';
export * from './core/platformManager';
export * from './core/pluginManager';
export * from './core/projectManager';
export * from './core/configManager';
export * from './core/configManager/schemeParser';
export * from './core/schemaManager';
export * from './core/runtimeManager';
export * from './core/templateManager';
export * from './core/taskManager';
export * from './core/systemManager/npmUtils';
export * from './core/systemManager/objectUtils';
export * from './core/systemManager/exec';
export * from './core/systemManager/fileutils';
export * from './core/systemManager/doctor';
export * from './core/systemManager/logger';
export * from './core/systemManager/resolve';
export * from './core/common';
export * from './core/systemManager/utils';
export * from './cli/prompt';
export * from './core/constants';

export * from './core/engineManager/types';
export * from './core/contextManager/types';
export * from './core/pluginManager/types';
export * from './core/projectManager/types';
export * from './core/configManager/types';
export * from './core/taskManager/types';
export * from './core/systemManager/types';
export * from './cli/types';
export * from './core/types';

export { CLI, Spinner };

export default { run, Config };
