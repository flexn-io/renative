import { AnyZodObject, z } from 'zod';
import { NpmDep, RnvTemplateConfigFragment, zodSupportedPlatforms, zodTemplateConfigFragment } from '../shared';

const zodBootstrapQuestionsSchema = z
    .array(
        z.object({
            options: z
                .array(
                    z.object({
                        title: z.string(),
                        value: z.union([z.record(z.string(), z.any()), z.string(), z.number(), z.boolean()]),
                    })
                )
                .optional(),
            configProp: z
                .object({
                    prop: z.string(),
                    key: z.string(),
                })
                .optional(),
            type: z.string(),
            title: z.string(),
            onConfirm: z
                .array(
                    z.object({
                        action: z.string(),
                        prop: z.string().optional(),
                        path: z.string(),
                    })
                )
                .optional(),
        })
    )
    .describe('Defines list of custom bootstrap questions');

const zodBootstrapConfig = z
    .object({
        bootstrapQuestions: zodBootstrapQuestionsSchema,
        rnvNewPatchDependencies: z
            .optional(NpmDep)
            .describe(
                'This ensures that the correct version of the npm packages will be used to run the project for the first time after creation'
            ),
        configModifiers: z.object({
            engines: z.array(
                z.object({
                    name: z.string(),
                    supportedPlatforms: zodSupportedPlatforms,
                    nullifyIfFalse: z.boolean().optional(),
                })
            ),
        }),
        defaultSelectedPlatforms: zodSupportedPlatforms.optional(),
    })
    .partial();

type RnvBootstrapConfig = z.infer<typeof zodBootstrapConfig>;

export const RootTemplateSchema: AnyZodObject = z.object({
    // defaults: z.optional(DefaultsSchema),
    // engines: z.optional(EnginesSchema),
    templateConfig: zodTemplateConfigFragment.optional(),
    bootstrapConfig: zodBootstrapConfig.optional(),
});

export type RnvRootTemplateSchema = {
    // defaults: RnvDefault,
    // engines: z.optional(EnginesSchema),
    templateConfig?: RnvTemplateConfigFragment;
    bootstrapConfig?: RnvBootstrapConfig;
};

// renative.template.json
export type ConfigFileTemplate = RnvRootTemplateSchema;

// {
//     title: 'Which service to use?',
//     type: 'list',
//     configProp: {
//         key: 'runtime.myServiceConfig',
//         file: 'renative.json',
//     },
//     options: [
//         {
//             title: 'Service 1',
//             value: {
//                 id: 'xxx1',
//             },
//         },
//         {
//             title: 'Service 2',
//             value: {
//                 id: 'xxx2',
//             },
//         },
//     ],
// },

// export type _RootTemplateSchemaType = z.infer<typeof RootTemplateSchema>;
