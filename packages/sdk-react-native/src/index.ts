export * from './common';
export * from './androidRunner';
export * from './iosRunner';
export * from './metroRunner';
export * from './adapters';
export * from './env';
import { GetContextType, createRnvSDK } from '@rnv/core';
import taskStart from './tasks/taskStart';

export const Tasks = [taskStart];

const Sdk = createRnvSDK({
    tasks: Tasks,
});

export type GetContext = GetContextType<typeof Sdk.getContext>;
