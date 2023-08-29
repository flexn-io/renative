export type ExecOptions = {
    interactive?: boolean;
    silent?: boolean;
    stdio?: 'pipe' | 'inherit';
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
    env?: Record<string, string>;
    ignoreErrors?: boolean;
    detached?: boolean;
    cwd?: string;
};

export type ExecCallback = (isError: boolean) => void;

export type ExecCallback2 = (result: any, isError: boolean) => void;

export type AnalyticsApi = {
    captureException: (e: string | Error, context: { extra: any }) => void;
    teardown: () => Promise<void>;
};

export type OverridesOptions = Array<{
    pattern: string;
    override: string;
}>;

export type TimestampPathsConfig = {
    timestamp: Array<string>;
};

export type RnvCLI = Record<string, object>;
