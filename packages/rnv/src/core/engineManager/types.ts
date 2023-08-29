export type RnvEngine = {
    config: RnvEngineConfig;
};

export type RnvEngineConfig = {
    id: string;
};

export type RnvEngineConfigMap = Record<string, RnvEngineConfig>;

export type RnvEngineInstallConfig = {
    key: string;
    version?: string;
    engineRootPath: string;
    configPath?: string;
};
