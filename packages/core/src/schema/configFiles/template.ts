import { z } from 'zod';

export const RootTemplateSchema = z.object({
    templateConfig: z
        .object({
            includedPaths: z
                .array(z.string())
                .describe('Defines list of all file/dir paths you want to include in template')
                .optional(),
            bootstrapQuestions: z
                .array(z.record(z.any()))
                .describe('Defines list of custom bootstrap questions')
                .optional(),
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
