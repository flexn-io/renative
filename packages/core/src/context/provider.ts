import type { RnvContext } from './types';

export const getContext = (): RnvContext => {
    return global.RNV_CONTEXT;
};
