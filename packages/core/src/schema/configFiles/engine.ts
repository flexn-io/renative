import { z } from 'zod';
import { zodExt, zodPlatformsKeys } from '../shared';

const zodNpmDep = z.record(z.string(), z.string());

const zodEngineNpm = z
    .object({
        dependencies: z.optional(zodNpmDep),
        devDependencies: z.optional(zodNpmDep),
        peerDependencies: z.optional(zodNpmDep),
        optionalDependencies: z.optional(zodNpmDep),
    })
    .describe('Npm dependencies required for this plugin to work');

const zodEnginePlatform = z.object({
    engine: z.optional(z.string()),
    npm: z.optional(zodEngineNpm),
});

export const RootEngineSchema = z
    .object({
        custom: z.optional(zodExt),
        id: z.string().describe('ID of engine'),
        packageName: z.string(),
        engineExtension: z.string().describe('Engine extension ised by rnv during compilation'),
        // extends: z.string().describe('ID of engine to extend. Not being used yet'),
        overview: z.string().describe('Overview description of engine'),
        plugins: z.record(z.string(), z.string()).describe('List of required plugins for this engine to work properly'),
        npm: zodEngineNpm,
        platforms: z.record(zodPlatformsKeys, zodEnginePlatform),
    })
    .partial();

export type RnvRootEngineSchema = z.infer<typeof RootEngineSchema>;
