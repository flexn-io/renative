export type RnvTask = {
    task: string;
    params: Array<string>;
    isGlobalScope: boolean;
};

export type RnvTaskMap = Record<string, RnvTask>;
