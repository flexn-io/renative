import { GetContextType, createRnvModule } from '@rnv/core';
import taskTelemetryStatus from './tasks/taskTelemetryStatus';
import taskTelemetryEnable from './tasks/taskTelemetryEnable';
import taskTelemetryDisable from './tasks/taskTelemetryDisable';
export * from './runner';

const Sdk = createRnvModule({
    tasks: [taskTelemetryStatus, taskTelemetryEnable, taskTelemetryDisable],
    name: '@rnv/sdk-telemetry',
    type: 'internal',
});

export type GetContext = GetContextType<typeof Sdk.getContext>;

export default Sdk;
