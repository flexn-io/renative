import { type ConfigFileIntegration } from '../schema/configFiles/integration';
import { RnvTask } from '../tasks/types';

export type RnvIntegration = {
    config: ConfigFileIntegration;
    tasks: Record<string, RnvTask>;
};
