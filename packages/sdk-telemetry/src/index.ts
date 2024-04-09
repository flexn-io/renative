import { GetContextType, createRnvModule } from '@rnv/core';
import taskTelemetryStatus from './tasks/taskTelemetryStatus';
import taskTelemetryEnable from './tasks/taskTelemetryEnable';
import taskTelemetryDisable from './tasks/taskTelemetryDisable';
export * from './runner';

const RnvModule = createRnvModule({
    tasks: [taskTelemetryStatus, taskTelemetryEnable, taskTelemetryDisable],
    name: '@rnv/sdk-telemetry',
    type: 'internal',
});

export default RnvModule;

export type GetContext = GetContextType<typeof RnvModule.getContext>;
