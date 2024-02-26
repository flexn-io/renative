import type { RnvContext } from './types';

// We separate this context access from the rest to avoid circular reference issues
export const getContext = <C = any>(): RnvContext<C> => {
    return global.RNV_CONTEXT;
};
