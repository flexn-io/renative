import type { RnvContext } from '../context/types';
import type { PlatformKey } from '../schema/types';

export type RnvTask = {
    task: string;
    params: Array<RnvTaskParameter>;
    isGlobalScope?: boolean;
    platforms: Array<PlatformKey>;
    description: string;
    forceBuildHookRebuild?: boolean;
    fn?: RnvTaskFn;
    fnHelp?: RnvTaskFn;
    isPrivate?: boolean;
    isPriorityOrder?: boolean;
    ignoreEngines?: boolean;
};

export type TaskOption = {
    name: string;
    value: string;
    command: string;
    asArray?: string[];
    subCommand?: string;
    subTasks?: TaskOption[];
    description?: string;
    isGlobalScope?: boolean;
    isPrivate?: boolean;
    isPriorityOrder?: boolean;
    providers: string[];
    params?: Array<RnvTaskParameter>;
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

//Too many choices of return types
export type RnvTaskFn = (c: RnvContext, parentTask?: string, originTask?: string) => Promise<any>; // Promise<boolean | void | string>;

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
