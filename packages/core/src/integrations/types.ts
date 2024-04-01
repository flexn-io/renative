import type { ConfigFileIntegration } from '../schema/types';
import { RnvTask } from '../tasks/types';

export type RnvIntegration = {
    config: ConfigFileIntegration;
    tasks: Record<string, RnvTask>;
};
