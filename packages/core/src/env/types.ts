export type RnvEnvContext = Record<string, string | number | string[] | undefined | boolean>;

export type RnvEnvContextOptions = {
    exludeEnvKeys?: Array<string>;
    includedEnvKeys?: Array<string>;
};
