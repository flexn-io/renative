import type { RnvContext } from '../context/types';
import type { ConfigFileEngine } from '../schema/types';
import type { RnvTask, RnvTaskMap } from '../tasks/types';
import type { RnvPlatformKey } from '../types';

export type RnvEnginePlatforms = Partial<Record<RnvPlatformKey, RnvEnginePlatform>>;

export type CreateRnvEngineOpts<OKey extends string> = {
    originalTemplatePlatformsDir?: string;
    platforms: RnvEnginePlatforms;
    config: ConfigFileEngine;
    tasks: ReadonlyArray<RnvTask<OKey>>;
    rootPath?: string;
    originalTemplatePlatformProjectDir?: string;
    projectDirName?: string;
    runtimeExtraProps?: Record<string, string>;
    outputDirName?: string;
    serverDirName?: string;
};

export type RnvEngine<OKey extends string = string> = {
    originalTemplatePlatformsDir?: string;
    platforms: RnvEnginePlatforms;
    config: ConfigFileEngine;
    tasks: RnvTaskMap<OKey>;
    rootPath?: string;
    originalTemplatePlatformProjectDir?: string;
    projectDirName: string;
    runtimeExtraProps: Record<string, string>;
    outputDirName?: string;
    serverDirName: string;
    getContext: () => RnvContext<any, OKey>;
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
