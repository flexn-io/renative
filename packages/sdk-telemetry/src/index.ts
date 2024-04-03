import { GetContextType, createRnvSDK } from '@rnv/core';
import taskTelemetryStatus from './tasks/taskTelemetryStatus';
import taskTelemetryEnable from './tasks/taskTelemetryEnable';
import taskTelemetryDisable from './tasks/taskTelemetryDisable';
export * from './runner';

const Sdk = createRnvSDK({
    tasks: [taskTelemetryStatus, taskTelemetryEnable, taskTelemetryDisable],
});

export type GetContext = GetContextType<typeof Sdk.getContext>;

export default Sdk;
