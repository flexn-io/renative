import { RnvConfig } from '../configManager/types';
import { RnvTaskMap } from '../taskManager/types';

export type RnvEngine = {
    originalTemplatePlatformsDir: string;
    platforms: Record<string, RnvEnginePlatform>;
    config: RnvEngineConfig;
    tasks: RnvTaskMap;
    initializeRuntimeConfig: (c: RnvConfig) => void;
    rootPath: string;
    originalTemplatePlatformProjectDir: string;
    projectDirName: string;
};

export type RnvEnginePlatform = {
    extensions: Array<string>;
};

export type RnvEngineConfig = {
    id: string;
    platforms: any;
    npm: any;
    plugins: any;
    packageName: string;
};

export type RnvEngineConfigMap = Record<string, RnvEngineConfig>;

export type RnvEngineInstallConfig = {
    key: string;
    version?: string;
    engineRootPath?: string;
    configPath?: string;
};

export type RenativeEngineConfig = {
    id: string;
    engineExtension: string;
    overview: string;
    plugins: Record<string, string>;
    npm: Record<string, Record<string, string>>;
    platforms: {
        ios: RenativeEngineConfigPlatform;
        macos: RenativeEngineConfigPlatform;
        android: RenativeEngineConfigPlatform;
        androidwear: RenativeEngineConfigPlatform;
        androidtv: RenativeEngineConfigPlatform;
        firetv: RenativeEngineConfigPlatform;
    };
};

export type RenativeEngineConfigPlatform = {
    engine: string;
    npm: {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
    };
};
