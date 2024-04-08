import { getContext } from '../context/provider';
import { generateRnvTaskMap } from '../tasks/taskHelpers';
import type { RnvIntegration, CreateRnvIntegrationOpts } from './types';

export const createRnvIntegration = <OKey extends string>(opts: CreateRnvIntegrationOpts<OKey>) => {
    const intg: RnvIntegration<OKey> = {
        ...opts,
        tasks: generateRnvTaskMap<OKey>(opts.tasks, opts.config),
        getContext: () => getContext<any, OKey>(),
    };

    return intg;
};
