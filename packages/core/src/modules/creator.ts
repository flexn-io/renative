import { getContext } from '../context/provider';
import { createTaskMap } from '../tasks/creators';
import type { CreateRnvModuleOpts, RnvModule } from './types';

export const createRnvModule = <OKey extends string>(opts: CreateRnvModuleOpts<OKey>) => {
    if (!opts.name) {
        throw new Error('Module name is required!');
    }

    const module: RnvModule<OKey> = {
        ...opts,
        name: opts.name,
        tasks: createTaskMap<OKey>({ tasks: opts.tasks, ownerID: opts.name, ownerType: opts.type }),
        getContext: () => getContext<any, OKey>(),
    };

    return module;
};
