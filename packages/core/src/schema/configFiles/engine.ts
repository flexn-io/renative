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

export const zodConfigFileEngine = z.object({
    custom: z.optional(zodExt),
    name: z.string().describe('Name of the engine (best to use name of the actual package)'),
    engineExtension: z.string().describe('Engine extension used by rnv during compilation'),
    overview: z.string().describe('Overview description of engine').optional(),
    plugins: z.record(z.string(), z.string()).describe('List of required plugins for this engine to work properly'),
    npm: zodEngineNpm,
    platforms: z.record(zodPlatformsKeys, zodEnginePlatform).optional(),
});
//  .partial();
