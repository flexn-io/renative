import { z } from 'zod';
import { DefaultsSchema, EnginesSchema } from './project';
import { NpmDep, TemplateConfig } from '../shared';

const BootstrapQuestionsSchema = z
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

const BootstrapConfig = z
    .object({
        bootstrapQuestions: BootstrapQuestionsSchema,
        rnvNewPatchDependencies: z
            .optional(NpmDep)
            .describe(
                'This ensures that the correct version of the npm packages will be used to run the project for the first time after creation'
            ),
        configModifiers: z.object({
            engines: z.array(
                z.object({
                    name: z.string(),
                    supportedPlatforms: z.array(z.string()),
                    nullifyIfFalse: z.boolean().optional(),
                })
            ),
        }),
    })
    .partial();

export const RootTemplateSchema = z.object({
    defaults: z.optional(DefaultsSchema),
    engines: z.optional(EnginesSchema),
    templateConfig: TemplateConfig.optional(),
    bootstrapConfig: BootstrapConfig.optional(),
});

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

export type _RootTemplateSchemaType = z.infer<typeof RootTemplateSchema>;
