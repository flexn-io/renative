import { RnvModuleType } from '../modules/types';
import type { CreateRnvTaskOpt, RnvTask, RnvTaskMap } from './types';

export const createTask = <OKey extends string>(task: CreateRnvTaskOpt<OKey>) => {
    const response: RnvTask<OKey> = { ...task, key: 'unknown', ownerID: 'unknown' };

    return response;
};

export const createTaskOptionsMap = () => {
    // TODO
};

export const createTaskMap = <OKey extends string>(opts: {
    tasks: ReadonlyArray<RnvTask<OKey>>;
    ownerID: string;
    ownerType: RnvModuleType;
}) => {
    const output: RnvTaskMap<OKey> = {};

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
