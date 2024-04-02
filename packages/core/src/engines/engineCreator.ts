import { getContext } from '../context/provider';
import { generateRnvTaskMap } from '../tasks/taskHelpers';
import type { CreateRnvEngineOpts, RnvEngine } from './types';

export const createRnvEngine = <OKey extends string>(opts: CreateRnvEngineOpts<OKey>) => {
    const engine: RnvEngine<OKey> = {
        ...opts,
        tasks: generateRnvTaskMap<OKey>(opts.tasks, opts.config),
        getContext: () => getContext<any, OKey>(),
    };

    return engine;
};
