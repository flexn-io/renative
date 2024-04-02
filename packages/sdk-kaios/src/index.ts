export * from './deviceManager';
export * from './runner';
export * from './constants';

import { GetContextType, createRnvSDK } from '@rnv/core';
import taskTargetLaunch from './tasks/taskTargetLaunch';

export const Tasks = [taskTargetLaunch];

const Sdk = createRnvSDK({
    tasks: Tasks,
});

export type GetContext = GetContextType<typeof Sdk.getContext>;
