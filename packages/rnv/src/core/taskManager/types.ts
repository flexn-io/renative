export type RnvTask = {
    task: string;
    params: Array<RnvTaskParameter>;
    isGlobalScope: boolean;
};

export type RnvTaskParameter = {
    shortcut: string;
    value: string;
    key: string;
    isRequired: boolean;
    description: string;
};

export type RnvTaskMap = Record<string, RnvTask>;
