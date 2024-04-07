import type { RnvContext } from '../context/types';
import type { RnvTask } from '../tasks/types';

export type CreateRnvSdkOpts<OKey extends string> = {
    tasks: ReadonlyArray<RnvTask<OKey>>;
};

export type RnvSdk<OKey extends string = string> = {
    tasks: ReadonlyArray<RnvTask<OKey>>;
    getContext: () => RnvContext<any, OKey>;
};
