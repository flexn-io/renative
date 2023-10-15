import { z } from 'zod';
import { Ext, PlatformsKeys } from '../shared';

// export type RenativeEngineConfig = {
//     id: string;
//     engineExtension: string;
//     overview: string;
//     plugins: Record<string, string>;
//     npm: Record<string, Record<string, string>>;
//     platforms: {
//         ios: RenativeEngineConfigPlatform;
//         macos: RenativeEngineConfigPlatform;
//         android: RenativeEngineConfigPlatform;
//         androidwear: RenativeEngineConfigPlatform;
//         androidtv: RenativeEngineConfigPlatform;
//         firetv: RenativeEngineConfigPlatform;
//     };
// };

// export type RenativeEngineConfigPlatform = {
//     engine: string;
//     npm: {
//         dependencies?: Record<string, string>;
//         devDependencies?: Record<string, string>;
//         peerDependencies?: Record<string, string>;
//     };
// };

// export type RenativeEngineConfigPlatform = {
//     engine: string;
//     npm: {
//         dependencies?: Record<string, string>;
//         devDependencies?: Record<string, string>;
//         peerDependencies?: Record<string, string>;
//     };
// };

const NpmDep = z.record(z.string(), z.string());

const EnginePlatform = z.object({
    engine: z.optional(z.string()),
    npm: z.optional(
        z.object({
            dependencies: z.optional(NpmDep),
            devDependencies: z.optional(NpmDep),
            peerDependencies: z.optional(NpmDep),
        })
    ),
});

//LEVEl 0 (ROOT)

const Id = z.string().describe('ID of engine');

const EngineExtension = z.string().describe('Engine extension ised by rnv during compilation');

const Plugins = z.record(z.string(), z.string()).describe('List of required plugins for this engine to work properly');

const Overview = z.string().describe('Overview description of engine');

const Npm = z.object({});

const Platforms = z.record(PlatformsKeys, EnginePlatform);

export const RootEngineSchema = z.object({
    ext: z.optional(Ext),
    id: Id,
    engineExtension: EngineExtension,
    overview: Overview,
    plugins: z.optional(Plugins),
    npm: z.optional(Npm),
    platforms: z.optional(Platforms),
});

export type _ConfigRootEngineType = z.infer<typeof RootEngineSchema>;
