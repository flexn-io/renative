export * from './common';
export * from './androidRunner';
export * from './iosRunner';
export * from './metroRunner';
export * from './adapters';
export * from './env';
import { GetContextType, createRnvModule } from '@rnv/core';
import taskStart from './tasks/taskStart';

export const Tasks = [taskStart];

const RnvModule = createRnvModule({
    tasks: Tasks,
    name: '@rnv/sdk-react-native',
    type: 'internal',
});

export default RnvModule;

export type GetContext = GetContextType<typeof RnvModule.getContext>;
