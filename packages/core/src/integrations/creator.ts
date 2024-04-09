import { getContext } from '../context/provider';
import { createTaskMap } from '../tasks/creators';
import type { RnvIntegration, CreateRnvIntegrationOpts } from './types';

export const createRnvIntegration = <OKey extends string>(opts: CreateRnvIntegrationOpts<OKey>) => {
    if (!opts.config.name) {
        throw new Error('Integration name is required. check your renative.integration.json file');
    }
    const intg: RnvIntegration<OKey> = {
        ...opts,
        tasks: createTaskMap<OKey>({ tasks: opts.tasks, ownerID: opts.config.name, ownerType: 'integration' }),
        getContext: () => getContext<any, OKey>(),
    };

    return intg;
};
