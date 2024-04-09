export * from './deviceManager';
export * from './runner';
export * from './constants';

import { GetContextType, createRnvModule } from '@rnv/core';
import taskTargetLaunch from './tasks/taskTargetLaunch';

export const Tasks = [taskTargetLaunch];

const RnvModule = createRnvModule({
    tasks: Tasks,
    name: '@rnv/sdk-kaios',
    type: 'internal',
});

export default RnvModule;

export type GetContext = GetContextType<typeof RnvModule.getContext>;
