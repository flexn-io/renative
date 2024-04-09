export * from './deviceManager';
export * from './runner';
export * from './constants';

import { GetContextType, createRnvModule } from '@rnv/core';
import taskTargetLaunch from './tasks/taskTargetLaunch';

export const Tasks = [taskTargetLaunch];

const Sdk = createRnvModule({
    tasks: Tasks,
    name: '@rnv/sdk-kaios',
    type: 'internal',
});

export type GetContext = GetContextType<typeof Sdk.getContext>;
