import { RnvTaskMap } from '../taskManager/types';

export type RnvEngine = {
    originalTemplatePlatformsDir: string;
    platforms: any;
    config: RnvEngineConfig;
    tasks: RnvTaskMap;
};

export type RnvEngineConfig = {
    id: string;
    platforms: any;
    npm: any;
    plugins: any;
};

export type RnvEngineConfigMap = Record<string, RnvEngineConfig>;

export type RnvEngineInstallConfig = {
    key: string;
    version?: string;
    engineRootPath: string;
    configPath?: string;
};
