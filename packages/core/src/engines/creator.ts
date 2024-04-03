import { generateEngineExtensions } from '.';
import { getContext } from '../context/provider';
import { generateRnvTaskMap } from '../tasks/taskHelpers';
import { RnvPlatformKey } from '../types';
import type { CreateRnvEngineOpts, RnvEngine, RnvEnginePlatforms } from './types';

export const createRnvEngine = <OKey extends string>(opts: CreateRnvEngineOpts<OKey>) => {
    const platforms: RnvEnginePlatforms = opts?.platforms;
    Object.keys(platforms).forEach((k) => {
        const p = k as RnvPlatformKey;
        const plat = platforms[p];
        if (plat) {
            plat.extensions = generateEngineExtensions(plat.extensions, opts.config);
        }
    });

    const engine: RnvEngine<OKey> = {
        ...opts,
        platforms,
        serverDirName: opts.serverDirName || '',
        projectDirName: opts.projectDirName || '',
        runtimeExtraProps: opts.runtimeExtraProps || {},
        tasks: generateRnvTaskMap<OKey>(opts.tasks, opts.config),
        getContext: () => getContext<any, OKey>(),
    };

    return engine;
};
