import { AnyZodObject, z } from 'zod';
import { zodRootAppBaseFragment } from './app';
import { zodConfigFileProject } from './project';
import { zodConfigFileLocal } from './local';
import { zodConfigFileTemplate } from './template';
import { zodConfigFileWorkspace } from './workspace';
import { zodConfigFileWorkspaces } from './workspaces';
import { zodConfigFileTemplates } from './templates';
import { zodConfigFileOverrides } from './overrides';
import { zodConfigFileIntergation } from './integration';
import { zodConfigFileEngine } from './engine';
import { zodConfigFilePlugin } from './plugin';
import { zodConfigFilePrivate } from './private';

export const zodConfigFileRoot: AnyZodObject = z.object({
    app: zodRootAppBaseFragment,
    project: zodConfigFileProject,
    local: zodConfigFileLocal,
    overrides: zodConfigFileOverrides,
    integration: zodConfigFileIntergation,
    engine: zodConfigFileEngine,
    plugin: zodConfigFilePlugin,
    private: zodConfigFilePrivate,
    template: zodConfigFileTemplate,
    configTemplates: zodConfigFileTemplates,
    workspace: zodConfigFileWorkspace,
    workspaces: zodConfigFileWorkspaces,
});
