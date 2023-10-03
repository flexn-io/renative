export type MonoPackageConfig = {
    pkgName?: string;

    pkgFile?: any;
    pkgPath?: string;

    rnvFile?: any;
    rnvPath?: string;

    metaFile?: any;
    metaPath?: string;

    plugTempFile?: any;
    plugTempPath?: string;

    templateConfigFile?: any;
    templateConfigPath?: string;
};

export type MonorepoConfig = Record<string, MonoPackageConfig>;
