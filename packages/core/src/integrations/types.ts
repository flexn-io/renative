import type { ConfigFileIntegration } from '../schema/types';
import type { RnvContext } from '../context/types';
import type { RnvTaskMap, RnvTask } from '../tasks/types';

export type CreateRnvIntegrationOpts<OKey extends string> = {
    config: ConfigFileIntegration;
    tasks: ReadonlyArray<RnvTask<OKey>>;
};

export type RnvIntegration<OKey extends string = string> = {
    config: ConfigFileIntegration;
    tasks: RnvTaskMap<OKey>;
    getContext: () => RnvContext<any, OKey>;
};
