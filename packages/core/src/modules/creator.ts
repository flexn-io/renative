import { getContext } from '../context/provider';
import { createTaskMap } from '../tasks/creators';
import type { CreateRnvModuleOpts, RnvModule } from './types';

export const createRnvModule = <OKey = never, Payload = object>(opts: CreateRnvModuleOpts<OKey, Payload>) => {
    if (!opts.name) {
        throw new Error('Module name is required!');
    }

    const module: RnvModule<OKey, Payload> = {
        ...opts,
        originalTasks: opts.tasks,
        name: opts.name,
        tasks: createTaskMap<OKey>({ tasks: opts.tasks, ownerID: opts.name, ownerType: opts.type }),
        getContext,
        initContextPayload: () => {
            const ctx = getContext();
            const payload = opts.contextPayload;
            if (payload) {
                const ctxPayload = ctx.payload;
                ctx.payload = { ...ctxPayload, ...payload };
            }
        },
    };

    return module;
};
