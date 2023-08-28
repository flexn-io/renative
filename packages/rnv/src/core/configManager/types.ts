export interface RnvConfog {
    program: any;
    command: any;
    paths: any;
    buildConfig: any;
    runtime: any;
    platform: string;
    files: any;
    configPropsInjects: any;
}

export type RnvConfigSchema = Record<string, any>;

export interface RnvConfigPathObj {
    dir: string;
    config: string;
    configLocal: string;
    configPrivate: string;
    appConfigsDir: string;
    dirs: Array<string>;
    fontsDirs: Array<string>;
    pluginDirs: Array<string>;
    configs: Array<string>;
    configsLocal: Array<string>;
    configsPrivate: Array<string>;
}

export interface RnvConfigFileObj {
    config: any;
    configLocal: any;
    configPrivate: any;
    configs: Array<any>;
    configsLocal: Array<any>;
    configsPrivate: Array<any>;
}
