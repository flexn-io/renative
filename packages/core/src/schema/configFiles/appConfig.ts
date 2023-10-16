import { z } from 'zod';
import { CommonSchema } from '../common';
import { Ext, ExtendTemplate } from '../shared';
import { PlatformsSchema } from '../platforms';
import { Plugins } from '../plugins';

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

export const RootAppSchemaPartial = z.object({
    id: z.optional(Id),
    custom: z.optional(Ext),
    hidden: z.optional(Hidden),
    extendsTemplate: z.optional(ExtendTemplate),
    extend: z.optional(Extend),
    skipBootstrapCopy: z.boolean().optional(),
});

export const RootAppSchema = RootAppSchemaPartial.merge(
    z.object({
        common: z.optional(CommonSchema),
        platforms: z.optional(PlatformsSchema),
        plugins: z.optional(Plugins),
    })
);

export type _RootAppSchemaPartialType = z.infer<typeof RootAppSchemaPartial>;

export type _RootAppSchemaType = z.infer<typeof RootAppSchema>;
