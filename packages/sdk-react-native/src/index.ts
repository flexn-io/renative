export * from './common';
export * from './androidRunner';
export * from './iosRunner';
export * from './metroRunner';
export * from './adapters';
export * from './env';
import { GetContextType, createRnvModule } from '@rnv/core';
import taskStart from './tasks/taskStart';

const RnvModule = createRnvModule({
    tasks: [taskStart] as const,
    name: '@rnv/sdk-react-native',
    type: 'internal',
});

export default RnvModule;

export type GetContext = GetContextType<typeof RnvModule.getContext>;
