import type { RnvContext } from '../context/types';
import type { RnvPlatformKey } from '../types';

export type RnvTask = {
    task: string;
    dependsOn?: string[];
    options?: Array<RnvTaskOption>;
    isGlobalScope?: boolean;
    platforms?: Array<RnvPlatformKey>;
    description: string;
    forceBuildHookRebuild?: boolean;
    beforeDependsOn?: RnvTaskFn;
    fn?: RnvTaskFn;
    fnHelp?: RnvTaskHelpFn;
    isPrivate?: boolean;
    isPriorityOrder?: boolean;
    ignoreEngines?: boolean;
    ownerID?: string;
    key?: string;
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

export type RnvTaskOption = {
    shortcut?: string;
    key?: string;
    isRequired?: boolean;
    isValueType?: boolean;
    isVariadic?: boolean;
    description: string;
    examples?: Array<string>;
    options?: Array<string>;
};

export type RnvTaskMap = Record<string, RnvTask>;

//Too many choices of return types
export type RnvTaskFn = (opts: {
    ctx: RnvContext;
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
