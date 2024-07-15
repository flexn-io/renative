import { RnvModuleType } from '../modules/types';
import type { CreateRnvTaskOpt, RnvTask, RnvTaskMap, RnvTaskOption } from './types';

export const createTask = <OKey = never>(task: CreateRnvTaskOpt<OKey>) => {
    const response: RnvTask<OKey> = { ...task, key: 'unknown', ownerID: 'unknown' };

    return response;
};

type TaskOptionsMap<OKey> = Record<Extract<OKey, string>, RnvTaskOption<OKey>>;
export const createTaskOptionsMap = <OKey>(opts: ReadonlyArray<RnvTaskOption<OKey>>) => {
    const map: Partial<TaskOptionsMap<OKey>> = {};
    opts.forEach((opt) => {
        if (opt.altKey) {
            map[opt.altKey] = opt;
        } else {
            map[opt.key] = opt;
        }
    });
    return map as TaskOptionsMap<OKey>;
};

type TaskOptionsPreset<OKey, PKey> = Record<
    Extract<PKey, string>,
    (arr?: ReadonlyArray<RnvTaskOption<OKey>>) => ReadonlyArray<RnvTaskOption<OKey>>
>;
export const createTaskOptionsPreset = <OKey, PKey extends string>(
    opts: Record<PKey, ReadonlyArray<RnvTaskOption<OKey>>>
) => {
    const preset: Partial<TaskOptionsPreset<OKey, PKey>> = {};
    for (const key in opts) {
        const oArr = opts[key];
        if (opts[key]) {
            preset[key] = (arr?) => oArr.concat(arr || []);
        }
    }

    return preset as TaskOptionsPreset<OKey, PKey>;
};

export const createTaskMap = <OKey, Payload>(opts: {
    tasks: ReadonlyArray<RnvTask<OKey, Payload>>;
    ownerID: string;
    ownerType: RnvModuleType;
}) => {
    const output: RnvTaskMap<OKey, Payload> = {};

    const { ownerID, tasks, ownerType } = opts;
    if (!ownerID) throw new Error('generateRnvTaskMap() requires config.<packageName | name> to be defined!');

    tasks.forEach((taskBlueprint) => {
        const taskInstance = { ...taskBlueprint };
        const plts = taskInstance.platforms || [];
        const key = `${ownerID}:${plts.join('-')}:${taskInstance.task}`;
        taskInstance.ownerID = ownerID;
        taskInstance.ownerType = ownerType;
        taskInstance.key = key;
        output[key] = taskInstance;
    });
    return output;
};
