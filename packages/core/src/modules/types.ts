import type { RnvContext } from '../context/types';
import type { RnvTask, RnvTaskMap } from '../tasks/types';

export type CreateRnvModuleOpts<OKey extends string> = {
    tasks: ReadonlyArray<RnvTask<OKey>>;
    name?: string;
    type: RnvModuleType;
};

export type RnvModule<OKey extends string = string> = {
    name: string;
    tasks: RnvTaskMap<OKey>;
    getContext: () => RnvContext<any, OKey>;
};

export type RnvModuleType = 'engine' | 'generic' | 'internal';
// engine - engine module (e.g. @rnv/engine-rn) capable of running platform aware tasks. only ONE engine module can be active at a time
// isPlatformAware - true, isInstallableViaConfig - true
// generic - generic module (e.g. @rnv/integration-docker) capable of running platform unaware tasks, installable via config
// isPlatformAware - false, isInstallableViaConfig - true
// internal - internal module (e.g. @rnv/engine-core) capable of running platform unaware tasks and is not installable via config (activated via code)
// isPlatformAware - false, isInstallableViaConfig - false
