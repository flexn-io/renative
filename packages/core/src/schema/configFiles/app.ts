import { AnyZodObject, z } from 'zod';
import { CommonSchema } from '../common';
import { Ext, ExtendTemplate } from '../shared';
import { PlatformsSchema } from '../platforms';
import { PluginsSchema } from '../plugins';

export const Extend = z.string().describe('extend another appConfig by id');

const Id = z
    .string()
    .describe('ID of the app in `./appConfigs/[APP_ID]/renative.json`. MUST match APP_ID name of the folder');

const Hidden = z
    .boolean()
    .describe(
        'If set to true in `./appConfigs/[APP_ID]/renative.json` the APP_ID will be hidden from list of appConfigs `-c`'
    );

//LEVEl 0 (ROOT)

const RootAppBaseFragment = {
    id: z.optional(Id),
    custom: z.optional(Ext),
    hidden: z.optional(Hidden),
    extendsTemplate: z.optional(ExtendTemplate),
    extend: z.optional(Extend),
    skipBootstrapCopy: z.boolean().optional(),
};

const RootAppBaseSchema = z.object(RootAppBaseFragment);
const RootAppCommonSchema = z.object({ common: z.optional(CommonSchema) });
const RootAppPlatformsSchema = z.object({ platforms: z.optional(PlatformsSchema) });
const RootAppPluginsSchema = z.object({ plugins: z.optional(PluginsSchema) });

// NOTE: Need to explictly type this to generic zod object to avoid TS error:
// The inferred type of this node exceeds the maximum length the compiler will serialize...
// This is ok we only use this full schema for runtime validations. actual types
export const RootAppSchema: AnyZodObject = RootAppBaseSchema.merge(RootAppCommonSchema)
    .merge(RootAppPlatformsSchema)
    .merge(RootAppPluginsSchema);

export type _RootAppBaseSchemalType = z.infer<typeof RootAppBaseSchema>;

export type _RootAppSchemaType = z.infer<typeof RootAppBaseSchema> &
    z.infer<typeof RootAppCommonSchema> &
    z.infer<typeof RootAppPlatformsSchema> &
    z.infer<typeof RootAppPluginsSchema>;
