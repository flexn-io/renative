import { z } from 'zod';
import { DefaultsSchema, EnginesSchema } from './project';

const NpmDep = z.record(z.string(), z.string());

const BootstrapQuestionsSchema = z
    .array(
        z.object({
            options: z
                .array(
                    z.object({
                        title: z.string(),
                        value: z.object({}),
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
        })
    )
    .describe('Defines list of custom bootstrap questions');

export const RootTemplateSchema = z.object({
    defaults: z.optional(DefaultsSchema),
    engines: z.optional(EnginesSchema),
    templateConfig: z
        .object({
            includedPaths: z
                .array(z.string())
                .describe('Defines list of all file/dir paths you want to include in template')
                .optional(),
            bootstrapQuestions: z.optional(BootstrapQuestionsSchema),
            packageTemplate: z.optional(
                z.object({
                    dependencies: z.optional(NpmDep),
                    devDependencies: z.optional(NpmDep),
                    peerDependencies: z.optional(NpmDep),
                    optionalDependencies: z.optional(NpmDep),
                    name: z.string().optional(),
                    version: z.string().optional(),
                })
            ),
        })
        .describe('Used in `renative.template.json` allows you to define template behaviour.')
        .optional(),
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
