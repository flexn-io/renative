import { RnvCommonSchema } from '../common';
import { RnvPlatformsSchema } from '../platforms';
import { RnvPluginsSchema } from '../plugins';
import { _RootAppBaseSchemalType } from './app';
import { _RootLocalSchemaType } from './local';
import { RnvRootProjectBaseFragment } from './project';
import { _RootTemplatesSchemaType } from './templates';
import { _RootWorkspaceSchemaType } from './workspace';

// NOTE: Why am I bothered with all this nonsense instead of just exporting root schema types?
// because infering full schema (complex zod types & unions) impacts TS server performance
// here I'm giving TS hand by offloading some of the heavy computations to predefined types and removing unions
// When all reantive json get merged into one file this happens conceptually anyway

type RootPluginsMerged = {
    scopedPluginTemplates: Record<string, _RootTemplatesSchemaType['pluginTemplates']>;
};

type Common = {
    common: RnvCommonSchema;
};

type PluginsMap = {
    plugins: RnvPluginsSchema;
};

type PlatformsMap = {
    platforms: RnvPlatformsSchema;
};

export type ConfigFileBuildConfig =
    //Templates
    _RootTemplatesSchemaType &
        //Global
        _RootWorkspaceSchemaType &
        //Plugins (multiple roots merged under scope object)
        RootPluginsMerged &
        //Project + App
        Required<RnvRootProjectBaseFragment> &
        _RootLocalSchemaType &
        _RootAppBaseSchemalType &
        Common &
        PluginsMap &
        PlatformsMap;
