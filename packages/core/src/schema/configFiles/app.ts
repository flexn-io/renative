import { AnyZodObject, z } from 'zod';
import { RnvCommonSchema } from '../common';
import { zodExt } from '../shared';
import { RnvPlatformsSchema } from '../platforms';
import { RnvPluginsSchema } from '../plugins';
import { zodRootProjectCommonSchema, zodRootProjectPlatformsSchema, zodRootProjectPluginsSchema } from './project';

const zodRootAppBaseFragment = z.object({
    id: z
        .string()
        .describe('ID of the app in `./appConfigs/[APP_ID]/renative.json`. MUST match APP_ID name of the folder'),
    custom: z.optional(zodExt),
    hidden: z
        .boolean()
        .describe(
            'If set to true in `./appConfigs/[APP_ID]/renative.json` the APP_ID will be hidden from list of appConfigs `-c`'
        ),
    extendsTemplate: z
        .string()
        .describe(
            'You can extend another renative.json file of currently applied template by providing relative or full package name path. Exampe: `@rnv/template-starter/renative.json`'
        ), // TODO: rename to "extendsConfig"
    extend: z.string().describe('extend another appConfig by id'), // TODO: rename to "extendsAppConfigID"
});
export type RnvRootAppBaseFragment = z.infer<typeof zodRootAppBaseFragment>;

// NOTE: Need to explictly type this to generic zod object to avoid TS error:
// The inferred type of this node exceeds the maximum length the compiler will serialize...
// This is ok we only use this full schema for runtime validations. actual types
export const RootAppSchema: AnyZodObject = zodRootAppBaseFragment
    .merge(zodRootProjectCommonSchema)
    .merge(zodRootProjectPlatformsSchema)
    .merge(zodRootProjectPluginsSchema);

export type RnvRootAppSchema = RnvRootAppBaseFragment & {
    common?: RnvCommonSchema;
    platforms?: RnvPlatformsSchema;
    plugins?: RnvPluginsSchema;
};
