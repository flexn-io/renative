import { RnvTask } from './types';

export const createTask = (task: RnvTask) => {
    // TODO: Implement generics later on
    // const opts = {};
    // if(task.options) {
    //     task.options.forEach(v => {
    //         opts[]
    //     })
    // }

    return { ...task };
};
