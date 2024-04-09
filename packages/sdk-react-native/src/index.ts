export * from './common';
export * from './androidRunner';
export * from './iosRunner';
export * from './metroRunner';
export * from './adapters';
export * from './env';
import { GetContextType, createRnvModule } from '@rnv/core';
import taskStart from './tasks/taskStart';

export const Tasks = [taskStart];

const Sdk = createRnvModule({
    tasks: Tasks,
    name: '@rnv/sdk-react-native',
    type: 'internal',
});

export type GetContext = GetContextType<typeof Sdk.getContext>;
