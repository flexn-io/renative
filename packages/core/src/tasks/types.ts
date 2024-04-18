import type { RnvContext } from '../context/types';
import type { RnvModuleType } from '../modules/types';
import type { RnvPlatformKey } from '../types';
import type { ProgramOptionsKey } from './taskOptions';

//TODO: make this properly typed. Pass integration type to getContext?
export type TaskOptionValue = any; // boolean | string | undefined;

export type UnionKey<T> = T extends string ? T : never;

export type ParamKeys<Okey, T> = Partial<Record<ProgramOptionsKey | UnionKey<Okey>, T>>;

export type CreateRnvTaskOpt<OKey> = {
    task: string;
    dependsOn?: string[];
    options?: ReadonlyArray<RnvTaskOption<OKey>>;
    isGlobalScope?: boolean;
    platforms?: Array<RnvPlatformKey>;
    description: string;
    forceBuildHookRebuild?: boolean;
    beforeDependsOn?: RnvTaskFn<OKey>;
    fn?: RnvTaskFn<OKey>;
    fnHelp?: RnvTaskHelpFn;
    isPrivate?: boolean;
    isPriorityOrder?: boolean;
    ignoreEngines?: boolean;
};

export type RnvTask<OKey = string, Payload = any> = {
    task: string;
    dependsOn?: string[];
    options?: ReadonlyArray<RnvTaskOption<OKey>>;
    isGlobalScope?: boolean;
    platforms?: Array<RnvPlatformKey>;
    description: string;
    forceBuildHookRebuild?: boolean;
    beforeDependsOn?: RnvTaskFn<OKey>;
    fn?: RnvTaskFn<OKey, Payload>;
    fnHelp?: RnvTaskHelpFn;
    isPrivate?: boolean;
    isPriorityOrder?: boolean;
    ignoreEngines?: boolean;
    ownerID?: string;
    ownerType?: RnvModuleType;
    key: string;
};

export type TaskPromptOption = {
    name: string;
    value: {
        taskName: string;
        subTsks?: TaskPromptOption[];
    };
    command: string;
    asArray?: string[];
    subCommand?: string;
    subTasks?: TaskPromptOption[];
    description?: string;
    isGlobalScope?: boolean;
    isPrivate?: boolean;
    isPriorityOrder?: boolean;
    providers: string[];
    params?: Array<RnvTaskOption>;
};

export type RnvTaskOption<OKey = string> = {
    shortcut?: string;
    key: OKey extends string ? OKey : never;
    isRequired?: boolean;
    isValueType?: boolean;
    isVariadic?: boolean;
    description: string;
    examples?: Array<string>;
};

export type RnvTaskMap<OKey = string> = Record<string, RnvTask<OKey>>;

//Too many choices of return types
export type RnvTaskFn<OKey, Payload = any> = (opts: {
    ctx: RnvContext<Payload, OKey>;
    taskName: string;
    parentTaskName: string | undefined;
    originTaskName: string | undefined;
    shouldSkip: boolean;
}) => Promise<any>; // Promise<boolean | void | string>;

export type RnvTaskHelpFn = () => Promise<void>;

export type TaskItemMap = Record<
    string,
    {
        desc?: string;
        taskKey: string;
    }
>;
