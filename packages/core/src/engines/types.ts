import type { RnvContext } from '../context/types';
import type { RnvModule } from '../modules/types';
import type { ConfigFileEngine } from '../schema/types';
import type { RnvTask, RnvTaskMap } from '../tasks/types';
import type { RnvPlatformKey } from '../types';

export type RnvEnginePlatforms = Partial<Record<RnvPlatformKey, RnvEnginePlatform>>;

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

type ExtractModulePayload<T extends RnvModule> = T extends RnvModule<any, infer Payload> ? Payload : never;

// type ExtractKeyedModule<OKey> = OKey extends string ? RnvModule<OKey> : never;

// export type KeyAwareModule<OKey> = OKey extends string
//     ? [RnvModule<OKey>, ...RnvModule<OKey>[]]
//     : [RnvModule<any>, ...RnvModule<any>[]];

// export type KeyAwareModule<OKey> = [RnvModule<OKey>, ...RnvModule<OKey>[]];

export type KeyAwareModule<OKey> = ReadonlyArray<RnvModule<OKey>>;

// export type KeyAwareModule<OKey> = [RnvModule<OKey>, ...RnvModule<OKey>[]];

export type CreateRnvEngineOpts<OKey, MOKey, Modules extends KeyAwareModule<MOKey>> = {
    originalTemplatePlatformsDir?: string;
    platforms: RnvEnginePlatforms;
    config: ConfigFileEngine;
    tasks: ReadonlyArray<RnvTask<OKey, any>>;
    // UnionToIntersection<ExtractModulePayload<Modules[number]>>>>;
    extendModules?: ReadonlyArray<RnvModule<OKey>>;
    rootPath?: string;
    originalTemplatePlatformProjectDir?: string;
    projectDirName?: string;
    runtimeExtraProps?: Record<string, string>;
    outputDirName?: string;
    serverDirName?: string;
};

export type RnvEngine<OKey = string, MOKey = string, Modules extends KeyAwareModule<MOKey> = any> = {
    originalTemplatePlatformsDir?: string;
    platforms: RnvEnginePlatforms;
    id: string;
    config: ConfigFileEngine;
    tasks: RnvTaskMap<OKey>;
    rootPath?: string;
    originalTemplatePlatformProjectDir?: string;
    projectDirName: string;
    runtimeExtraProps: Record<string, string>;
    outputDirName?: string;
    serverDirName: string;
    getContext: () => RnvContext<UnionToIntersection<ExtractModulePayload<Modules[number]>>, OKey>;
};

export type RnvEnginePlatform = {
    extensions: Array<string>;
    isWebHosted?: boolean;
    defaultPort: number;
};

export type RnvEngineTemplate = {
    id: string;
    packageName?: string;
};

export type RnvEngineTemplateMap = Record<string, RnvEngineTemplate>;

export type RnvEngineInstallConfig = {
    key: string;
    version?: string;
    engineRootPath?: string;
    configPath?: string;
};

// export type GetContextType<T extends RnvEngine> = () => RnvContext<
//     any,
//     Extract<keyof Required<T['tasks'][string]>['options'], string>
// >;

// export type GetContextType<T extends RnvEngine> = () => RnvContext<
//     any,
//     Extract<keyof Readonly<Required<T['tasks'][string]>['options']>[number]['key'], string>
// >;

// Readonly < Required < Eng['tasks'][string] > ['options'] > [number]['key'];

// type Booo<T extends RnvEngine> = Readonly<Required<T['tasks'][string]>['options']>[number]['key'];
