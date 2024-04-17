export * from './deviceManager';
export * from './installer';
export * from './runner';
export * from './constants';

import taskTargetLaunch from './tasks/taskTargetLaunch';
import taskTargetList from './tasks/taskTargetList';
import taskSdkConfigure from './tasks/taskSdkConfigure';
import { GetContextType, createRnvModule } from '@rnv/core';

const RnvModule = createRnvModule({
    tasks: [taskTargetLaunch] as const,
    name: '@rnv/sdk-tizen',
    type: 'internal',
});

export default RnvModule;

export type GetContext = GetContextType<typeof RnvModule.getContext>;
