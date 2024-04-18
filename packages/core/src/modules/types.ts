import type { RnvContext } from '../context/types';
import type { RnvTask, RnvTaskMap } from '../tasks/types';

export type CreateRnvModuleOpts<OKey, Payload> = {
    tasks: ReadonlyArray<RnvTask<OKey>>;
    name?: string;
    type: RnvModuleType;
    contextPayload?: Payload extends object ? Payload : never;
};

export type RnvModule<OKey = string, Payload = any> = {
    name: string;
    tasks: RnvTaskMap<OKey>;
    originalTasks: ReadonlyArray<RnvTask<OKey>>;
    getContext: () => RnvContext<Payload, OKey>;
    initContextPayload: () => void;
};

export type RnvModuleType = 'engine' | 'public' | 'internal';
// engine - engine module (e.g. @rnv/engine-rn) capable of running platform aware tasks. only ONE engine module can be active at a time
// isPlatformAware - true, isInstallableViaConfig - true
// public - generic module (e.g. @rnv/integration-docker) capable of running platform unaware tasks, installable via config
// isPlatformAware - false, isInstallableViaConfig - true
// internal - internal module (e.g. @rnv/engine-core) capable of running platform unaware tasks and is not installable via config (activated via code)
// isPlatformAware - false, isInstallableViaConfig - false
