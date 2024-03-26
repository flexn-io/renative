import { ConfigFileIntegration } from '../schema/configFiles/types';
import { RnvTask } from '../tasks/types';

export type RnvIntegration = {
    config: ConfigFileIntegration;
    tasks: Record<string, RnvTask>;
};
