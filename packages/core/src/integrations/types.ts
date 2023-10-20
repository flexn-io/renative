import { ConfigFileIntegration } from '../schema/configFiles/types';
import { RnvTask } from '../tasks/types';

export type RnvIntegration = {
    config: ConfigFileIntegration;
    getTasks: () => Array<RnvTask>;
};
