import { z } from 'zod';
import {
    Common,
    Hidden,
    Id,
    Platforms,
    Plugins,
    Version,
    VersionCode,
    VersionCodeFormat,
    VersionFormat,
} from './configLevel1';
import { Ext } from './configCommon';

//LEVEl 0 (ROOT)

export const RootApp = z.object({
    id: z.optional(Id),
    version: z.optional(Version),
    versionCode: z.optional(VersionCode),
    versionFormat: z.optional(VersionFormat),
    versionCodeFormat: z.optional(VersionCodeFormat),
    common: Common,
    platforms: z.optional(Platforms),
    ext: z.optional(Ext),
    hidden: z.optional(Hidden),
    plugins: z.optional(Plugins),
});

export type ConfigRootApp = z.infer<typeof RootApp>;
