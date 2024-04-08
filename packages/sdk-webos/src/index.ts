export * from './deviceManager';
export * from './installer';
export * from './runner';
export * from './constants';
import taskTargetLaunch from './tasks/taskTargetLaunch';
import taskTargetList from './tasks/taskTargetList';
import taskSdkConfigure from './tasks/taskSdkConfigure';
import { GetContextType, createRnvSDK } from '@rnv/core';

export const Tasks = [taskTargetLaunch, taskTargetList, taskSdkConfigure];

const Sdk = createRnvSDK({
    tasks: Tasks,
});

export type GetContext = GetContextType<typeof Sdk.getContext>;
