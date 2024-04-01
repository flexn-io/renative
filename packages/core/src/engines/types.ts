import type { ConfigFileEngine } from '../schema/types';
import type { RnvTaskMap } from '../tasks/types';
import type { RnvPlatformKey } from '../types';

export type RnvEngine = {
    originalTemplatePlatformsDir?: string;
    platforms: Partial<Record<RnvPlatformKey, RnvEnginePlatform>>;
    config: ConfigFileEngine;
    tasks: RnvTaskMap;
    rootPath?: string;
    originalTemplatePlatformProjectDir?: string;
    projectDirName: string;
    runtimeExtraProps: Record<string, string>;
    outputDirName?: string;
    serverDirName: string;
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
