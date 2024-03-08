import { z } from 'zod';
import { SUPPORTED_PLATFORMS } from '../../constants';

export const Runtime = z
    .any()
    .describe(
        'This object will be automatically injected into `./platfromAssets/renative.runtime.json` making it possible to inject the values directly to JS source code'
    );

export const PlatformsKeys = z.enum(SUPPORTED_PLATFORMS);

export type _PlatformsKeysType = z.infer<typeof PlatformsKeys>;

export const HexColor = z.string().min(4).max(9).regex(/^#/);

export const Ext = z
    .any()
    .describe(
        'Object used to extend your renative with custom props. This allows renative json schema to be validated'
    );

export const ExtendTemplate = z
    .string()
    .describe(
        'You can extend another renative.json file of currently applied template by providing relative or full package name path. Exampe: `@rnv/template-starter/renative.json`'
    );

export const DefaultTargets = z
    .record(PlatformsKeys, z.string())
    .describe('Define targets to be used when -t is not set on any project run');

export const BundleId = z.string().describe('Bundle ID of application. ie: com.example.myapp');

export const BuildSchemeFragment = {
    enabled: z.optional(z.boolean().describe('Defines whether build scheme shows up in options to run')),
    description: z.optional(
        z
            .string()
            .describe(
                'Custom description of the buildScheme will be displayed directly in cli if you run rnv with an empty paramener `-s`'
            )
    ),
};

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

export const TemplateConfig = z
    .object({
        disabled: z.boolean().optional(),
        includedPaths: z
            .array(
                z.union([
                    z.string(),
                    z.object({
                        paths: z.array(z.string()),
                        engines: z.array(z.string()).optional(),
                    }),
                ])
            )
            .describe('Defines list of all file/dir paths you want to include in template')
            .optional(),
        bootstrapQuestions: BootstrapQuestionsSchema.optional(),
        renative_json: z
            .object({
                $schema: z.string().optional(),
                extendsTemplate: z.string().optional(),
            })
            .passthrough()
            .optional(),
        package_json: z.optional(
            z
                .object({
                    dependencies: z.optional(NpmDep),
                    devDependencies: z.optional(NpmDep),
                    peerDependencies: z.optional(NpmDep),
                    optionalDependencies: z.optional(NpmDep),
                    name: z.string().optional(),
                    version: z.string().optional(),
                })
                .passthrough()
        ),
    })
    .describe('Used in `renative.template.json` allows you to define template behaviour.');
