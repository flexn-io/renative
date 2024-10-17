import { AnyZodObject, z } from 'zod';
import { zodNpmDep, zodSupportedPlatforms, zodTemplateConfigFragment } from '../shared';

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

export const zodConfigTemplateBootstrapConfig = z
    .object({
        bootstrapQuestions: zodBootstrapQuestionsSchema,
        rnvNewPatchDependencies: z
            .optional(zodNpmDep)
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
        defaultSelectedPlatforms: zodSupportedPlatforms,
    })
    .partial();

export const zodConfigFileTemplate: AnyZodObject = z
    .object({
        // defaults: z.optional(DefaultsSchema),
        // engines: z.optional(EnginesSchema),
        templateConfig: zodTemplateConfigFragment,
        bootstrapConfig: zodConfigTemplateBootstrapConfig,
    })
    .partial();

// {
//     title: 'Which service to use?',
//     type: 'list',
//     configProp: {
//         key: 'runtime.myServiceConfig',
//         file: 'RnvFileName.renative',
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
