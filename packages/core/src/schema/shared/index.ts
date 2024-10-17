import { z } from 'zod';
import { RnvPlatforms } from '../../enums/platformName';

export const zodRuntime = z
    .any()
    .describe(
        'This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code'
    );

export const zodPlatformsKeys = z.enum(RnvPlatforms);

export const zodSupportedPlatforms = z
    .array(zodPlatformsKeys)
    .describe('Array list of all supported platforms in current project');

export const zodExt = z
    .any()
    .describe(
        'Object used to extend your renative with custom props. This allows renative json schema to be validated'
    );

export const zodDefaultTargets = z
    .record(zodPlatformsKeys, z.string())
    .describe('Define targets to be used when -t is not set on any project run');

export const zodBuildSchemeFragment = z
    .object({
        enabled: z.boolean().describe('Defines whether build scheme shows up in options to run'),
        description: z
            .string()
            .describe(
                'Custom description of the buildScheme will be displayed directly in cli if you run rnv with an empty paramener `-s`'
            ),
    })
    .partial();

export const zodNpmDep = z.record(z.string(), z.string());

export const zodTemplateConfigFragment = z
    .object({
        name: z.string().optional(),
        version: z.string().optional(),
        disabled: z.boolean().optional(),
        includedPaths: z
            .array(
                z.union([
                    z.string(),
                    z.object({
                        paths: z.array(z.string()),
                        engines: z.array(z.string()).optional(),
                        platforms: zodSupportedPlatforms.optional(),
                    }),
                ])
            )
            .describe('Defines list of all file/dir paths you want to include in template')
            .optional(),
        // bootstrapQuestions: BootstrapQuestionsSchema.optional(),
        renative_json: z
            .object({
                $schema: z.string().optional(),
                extendsTemplate: z.string().optional(),
            })

            .optional(),
        package_json: z.optional(
            z
                .object({
                    dependencies: zodNpmDep,
                    devDependencies: zodNpmDep,
                    peerDependencies: zodNpmDep,
                    optionalDependencies: zodNpmDep,
                    name: z.string(),
                    version: z.string(),
                    browserslist: z.any(),
                    scripts: z
                        .record(z.string(), z.string())
                        .describe('Defines scripts you want to include in template'),
                })
                .partial()
        ),
    })
    .describe('Used in `renative.template.json` allows you to define template behaviour.');

export const zodProjectTemplates = z.record(
    z.string(),
    z.object({
        packageName: z.string().optional(),
        description: z.string().optional(),
        localPath: z.string().optional(),
    })
);
