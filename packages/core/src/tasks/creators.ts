import { CreateRnvTaskOpt, RnvTask } from './types';

export const createTask = <OKey extends string>(task: CreateRnvTaskOpt<OKey>) => {
    const response: RnvTask<OKey> = { ...task, key: 'unknown', ownerID: 'unknown' };

    return response;
};

export const createTaskOptionsMap = () => {
    // TODO
};
