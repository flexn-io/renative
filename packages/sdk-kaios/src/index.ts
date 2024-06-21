export * from './deviceManager';
export * from './runner';
export * from './constants';

import { GetContextType, createRnvModule } from '@rnv/core';
import taskTargetLaunch from './tasks/taskTargetLaunch';
import taskTargetList from './tasks/taskTargetList';

const RnvModule = createRnvModule({
    tasks: [taskTargetLaunch, taskTargetList] as const,
    name: '@rnv/sdk-kaios',
    type: 'internal',
});

export default RnvModule;

export type GetContext = GetContextType<typeof RnvModule.getContext>;
