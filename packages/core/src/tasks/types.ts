import type { RnvContext } from '../context/types';
import { RnvModuleType } from '../modules/types';
import type { RnvPlatformKey } from '../types';

export type CreateRnvTaskOpt<OKey extends string = string> = {
    task: string;
    dependsOn?: string[];
    options?: ReadonlyArray<RnvTaskOption<OKey>>;
    isGlobalScope?: boolean;
    platforms?: Array<RnvPlatformKey>;
    description: string;
    forceBuildHookRebuild?: boolean;
    beforeDependsOn?: RnvTaskFn;
    fn?: RnvTaskFn<OKey>;
    fnHelp?: RnvTaskHelpFn;
    isPrivate?: boolean;
    isPriorityOrder?: boolean;
    ignoreEngines?: boolean;
};

export type RnvTask<OKey extends string = string, Payload = any> = {
    task: string;
    dependsOn?: string[];
    options?: ReadonlyArray<RnvTaskOption<OKey>>;
    isGlobalScope?: boolean;
    platforms?: Array<RnvPlatformKey>;
    description: string;
    forceBuildHookRebuild?: boolean;
    beforeDependsOn?: RnvTaskFn;
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

export type RnvTaskOption<OKey extends string = string> = {
    shortcut?: string;
    key: OKey;
    isRequired?: boolean;
    isValueType?: boolean;
    isVariadic?: boolean;
    description: string;
    examples?: Array<string>;
    // options?: ReadonlyArray<RnvTaskOption<OKey>>;
};

export type RnvTaskMap<OKey extends string = string> = Record<string, RnvTask<OKey>>;

//Too many choices of return types
export type RnvTaskFn<OKey extends string = string, Payload = any> = (opts: {
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

export type TaskObj = {
    key: string;
    taskInstance: RnvTask;
    // hasMultipleSubTasks?: boolean;
};
