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
};

export type ExecCallback = (isError: boolean) => void;

export type ExecCallback2 = (result: any, isError: boolean) => void;
