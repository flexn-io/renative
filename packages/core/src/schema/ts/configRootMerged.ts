import { _PlatformMergedType } from '../zod/configPlatforms';
import { _PluginPartialType } from '../zod/configPlugins';
import { _RootAppSchemaPartialType } from '../zod/configRootApp';
import type { _RootProjectSchemaPartialType } from '../zod/configRootProject';
// import type { RenativeConfigFile } from './types';

// NOTE: Why am I bothered with all this nonsense instead of just exporting root schema types?
// because infering full schema (complex zod types & unions) impacts TS server performance
// here I'm giving TS hand by offloading some of the heavy computations to predefined types and removing unions
// When all reantive json get merged into one file this happens conceptually anyway

export type ConfigRootMerged = _RootProjectSchemaPartialType &
    _RootAppSchemaPartialType & {
        plugins: Record<string, _PluginPartialType>;
        platforms: Record<string, _PlatformMergedType>;
    };

export const test = (test: ConfigRootMerged) => {
    console.log(test);

    const plugin = test.plugins['ss'];
    if (typeof plugin !== 'string') {
        console.log(plugin);
    }
};
