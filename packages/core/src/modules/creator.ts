import { getContext } from '../context/provider';
import { createTaskMap } from '../tasks/creators';
import type { CreateRnvModuleOpts, RnvModule } from './types';

export const createRnvModule = <Payload extends object, OKey extends string = string>(
    opts: CreateRnvModuleOpts<OKey>
) => {
    if (!opts.name) {
        throw new Error('Module name is required!');
    }

    const module: RnvModule<OKey, Payload> = {
        ...opts,
        originalTasks: opts.tasks,
        name: opts.name,
        tasks: createTaskMap<OKey>({ tasks: opts.tasks, ownerID: opts.name, ownerType: opts.type }),
        getContext,
    };

    return module;
};
