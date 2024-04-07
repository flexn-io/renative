import type { ProgramOptionsKey } from '../tasks/constants';
import type { RnvContext } from './types';

// We separate this context access from the rest to avoid circular reference issues
export const getContext = <C = any, T extends string = ProgramOptionsKey>(): RnvContext<C, T> => {
    return global.RNV_CONTEXT as RnvContext<C, T>;
};
