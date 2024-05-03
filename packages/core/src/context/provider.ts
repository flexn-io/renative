import type { ProgramOptionsKey } from '../tasks/taskOptions';
import type { RnvContext } from './types';

// We separate this context access from the rest to avoid circular reference issues
export const getContext = <C = any, OKey = ProgramOptionsKey>(): RnvContext<C, OKey> => {
    return global.RNV_CONTEXT as RnvContext<C, OKey>;
};
