export type DoResolveFn = (aPath?: string, mandatory?: boolean, options?: ResolveOptions) => string | undefined;

export type ResolveOptions = {
    basedir?: string;
    forceForwardPaths?: boolean;
    extensions?: Array<string>;
    keepSuffix?: boolean;
};

export type ExecOptions = {
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
};

export type ExecCallback = (result: unknown, isError: boolean) => void;

export type OverridesOptions = Array<{
    pattern: string;
    override: string | number | undefined;
}>;

export type TimestampPathsConfig = {
    timestamp: number;
    paths: Array<string>;
};

export type RnvCLI = Record<string, object>;

export type FileUtilsPropConfig = {
    props: Record<string, string>;
    configProps?: Record<string, any> | undefined;
    runtimeProps?: Record<string, any> | undefined;
    files?: Record<string, any> | undefined;
};
