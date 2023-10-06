export type ExecOptions = {
    interactive?: boolean;
    silent?: boolean;
    stdio?: 'pipe' | 'inherit' | 'ignore';
    shell?: boolean;
    localDir?: string;
    preferLocal?: boolean;
    all?: boolean;
    maxErrorLength?: number;
    mono?: boolean;
    rawCommand?: {
        args: Array<string>;
    };
    privateParams?: Array<string>;
    env?: Record<string, any>; // NodeJS.Process['env'];
    ignoreErrors?: boolean;
    detached?: boolean;
    cwd?: string;
    timeout?: number;
    printableEnvKeys?: Array<string>;
};

export type ExecCallback = (isError: boolean) => void;

export type ExecCallback2 = (result: any, isError: boolean) => void;

export type OverridesOptions = Array<{
    pattern: string;
    override: string;
}>;

export type TimestampPathsConfig = {
    timestamp: number;
    paths: Array<string>;
};

export type RnvCLI = Record<string, object>;

export type FileUtilsPropConfig = {
    props: Record<string, string>;
    configProps?: Record<string, string>;
    runtimeProps?: Record<string, any>;
    files?: Record<string, any>;
};
