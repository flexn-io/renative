import { RnvConfig } from '../configManager/types';

export type RnvTask = {
    task: string;
    params: Array<RnvTaskParameter>;
    isGlobalScope?: boolean;
    platforms: Array<string>;
    description: string;
    forceBuildHookRebuild?: boolean;
    fn?: RnvTaskFn;
    fnHelp?: RnvTaskFn;
};

export type RnvTaskParameter = {
    shortcut?: string;
    value?: string;
    key?: string;
    isRequired?: boolean;
    description: string;
    examples?: Array<string>;
    options?: Array<string>;
    variadic?: boolean;
};

export type RnvTaskMap = Record<string, RnvTask>;

export type RnvTaskFn = (c: RnvConfig, parentTask: string, originTask: string) => Promise<boolean | void | string>;
