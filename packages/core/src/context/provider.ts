import type { RnvContext } from './types';

export const getContext = <C = any>(): RnvContext<C> => {
    return global.RNV_CONTEXT;
};
