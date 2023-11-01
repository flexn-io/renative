import { z } from 'zod';
import { Ext, PlatformsKeys } from '../shared';

const NpmDep = z.record(z.string(), z.string());

const Npm = z
    .object({
        dependencies: z.optional(NpmDep),
        devDependencies: z.optional(NpmDep),
        peerDependencies: z.optional(NpmDep),
        optionalDependencies: z.optional(NpmDep),
    })
    .describe('Npm dependencies required for this plugin to work');

const EnginePlatform = z.object({
    engine: z.optional(z.string()),
    npm: z.optional(Npm),
});

//LEVEl 0 (ROOT)

const Id = z.string().describe('ID of engine');

const EngineExtension = z.string().describe('Engine extension ised by rnv during compilation');

const Plugins = z.record(z.string(), z.string()).describe('List of required plugins for this engine to work properly');

const Overview = z.string().describe('Overview description of engine');

const Platforms = z.record(PlatformsKeys, EnginePlatform);

export const RootEngineSchema = z.object({
    custom: z.optional(Ext),
    id: Id,
    engineExtension: EngineExtension,
    overview: Overview,
    plugins: z.optional(Plugins),
    npm: z.optional(Npm),
    platforms: z.optional(Platforms),
});

export type _ConfigRootEngineType = z.infer<typeof RootEngineSchema>;
