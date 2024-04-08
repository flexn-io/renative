import path from 'path';
import type { RnvContext } from '../context/types';
import type { ConfigFileBuildConfig, ConfigProp, ConfigPropKey } from '../schema/types';
import type { DoResolveFn } from '../system/types';
import type { RnvPlatform } from '../types';
import fs from 'fs';

export type RnvApi = {
    isDefault: boolean;
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    analytics: RnvContextAnalytics;
    // chalk: RnvApiChalk;
    logger: RnvApiLogger;
    fsExistsSync: typeof fs.existsSync;
    fsReadFileSync: (dest: fs.PathLike | undefined) => Buffer;
    fsReaddirSync: (dest: fs.PathLike | undefined) => string[];
    fsWriteFileSync: (dest: string | undefined, data: string, options?: fs.WriteFileOptions) => void;
    path: typeof path;
    doResolve: DoResolveFn;
    getConfigProp: GetConfigPropFn;
};

export type RnvApiSpinner = (msg: string | { text: string }) => {
    start: RnvApiSpinner;
    fail: RnvApiSpinner;
    succeed: RnvApiSpinner;
    text: string;
};

export type RnvApiPrompt = {
    inquirerPrompt: (options: PromptParams) => Promise<any>;
    generateOptions: (
        inputData: any,
        isMultiChoice?: boolean,
        mapping?: any,
        renderMethod?: PromptRenderFn
    ) => PromptOptions;
    inquirerSeparator: (text?: string) => any;
};

export type RnvContextAnalytics = {
    captureEvent: (ops: { type: string; platform?: RnvPlatform; template?: string; platforms?: Array<string> }) => void;
    captureException: (e: string | Error, context: { extra: any }) => void;
    teardown: () => Promise<void>;
};

export type RnvApiChalk = {
    white: RnvApiChalkFn;
    green: RnvApiChalkFn;
    red: RnvApiChalkFn;
    yellow: RnvApiChalkFn;
    // default: RnvApiChalkFn;
    gray: RnvApiChalkFn;
    grey: RnvApiChalkFn;
    blue: RnvApiChalkFn;
    cyan: RnvApiChalkFn;
    magenta: RnvApiChalkFn;
    rgb: (red: number, green: number, blue: number) => any;
    bold: RnvApiChalkFn;
};

export type RnvApiChalkFn = ((v: any) => any) & RnvApiChalk;

export type RnvApiLogger = {
    logWelcome: () => void;
    logAndSave: (msg: string, skipLog?: boolean) => void;
    getCurrentCommand: (excludeDollar: boolean) => void;
    logToSummary: (v: string, sanitizePaths?: () => string) => void;
    logRaw: (...args: Array<string>) => void;
    logSummary: (opts?: { header: string }) => void;
    logTask: (task: string, customChalk?: any) => void;
    logInitTask: (task: string, customChalk?: string | ((s: string) => string)) => void;
    logExitTask: (task: string, customChalk?: (s: string) => string) => void;
    logHook: (hook: string, msg?: string) => void;
    logWarning: (msg: string | boolean | unknown) => void;
    logInfo: (msg: string) => void;
    logDefault: (task: string, customChalk?: any) => void;
    logDebug: (...args: Array<any>) => void;
    isInfoEnabled: () => boolean;
    logSuccess: (msg: string) => void;
    logError: (e: Error | string | unknown, opts?: { skipAnalytics: boolean }) => void;
    logInitialize: () => void;
    logAppInfo: (c: RnvContext) => void;
    printIntoBox: (str: string) => string;
    printArrIntoBox: (arr: Array<string>, prefix?: string) => string;
    printBoxStart: (str: string, str2?: string) => string;
    printBoxEnd: () => string;
    chalk: () => RnvApiChalk;
};

export type PromptOptions = {
    keysAsArray: string[];
    valuesAsArray: Array<any>;
    keysAsObject: Record<string, string>;
    valuesAsObject: Record<string, any>;
    asString: string;
    optionsAsArray: Array<any>;
};

export type PromptParams = {
    name?: string;
    type: string;
    message?: string;
    choices?: Array<{ name: string; value: any } | string>;
    validate?: (i: string) => string | boolean;
    logMessage?: string;
    warningMessage?: string;
    default?: any; // string | boolean | (() => string) | string[] | number | { name: string; value: any };
    pageSize?: number;
    loop?: boolean;
};

export type PromptRenderFn = (i: number, obj: any, mapping: any, defaultVal: string) => string;

export type GetConfigPropFn<T = ConfigPropKey> = T extends ConfigPropKey
    ? <T extends ConfigPropKey>(
          key: T,
          defaultVal?: ConfigProp[T],
          obj?: Partial<ConfigFileBuildConfig>
      ) => ConfigProp[T] | undefined
    : <T>(key: string, defaultVal?: T, obj?: Partial<ConfigFileBuildConfig>) => T | undefined;
