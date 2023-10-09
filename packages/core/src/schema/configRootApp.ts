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
import { Ext } from './common/configCommon';
import { Extend, ExtendTemplate } from './configLevel2';

//LEVEl 0 (ROOT)

const RootApp = z.object({
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
    extendsTemplate: z.optional(ExtendTemplate),
    extend: z.optional(Extend),
});

export type ConfigRootApp = z.infer<typeof RootApp>;
