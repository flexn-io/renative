import { generateEngineExtensions } from '.';
import { getContext } from '../context/provider';
import { createTaskMap } from '../tasks/creators';
import { RnvPlatformKey } from '../types';
import { extractEngineId } from './nameExtractor';
import type { CreateRnvEngineOpts, KeyAwareModule, RnvEngine, RnvEnginePlatforms } from './types';

export const createRnvEngine = <OKey, Modules extends KeyAwareModule<OKey>>(
    opts: CreateRnvEngineOpts<OKey, Modules>
) => {
    if (!opts.config.name) {
        throw new Error('Engine name is required. check your renative.engine.json file');
    }
    // This allows users to use shortcut of the full engine names
    // ie: "-e engine-rn" instead of "-e @rnv/engine-rn"
    const id = extractEngineId(opts.config.name);
    const platforms: RnvEnginePlatforms = opts?.platforms;
    Object.keys(platforms).forEach((k) => {
        const p = k as RnvPlatformKey;
        const plat = platforms[p];
        if (plat) {
            plat.extensions = generateEngineExtensions(id, plat.extensions, opts.config.engineExtension);
        }
    });

    const engine: RnvEngine<OKey, Modules> = {
        ...opts,
        platforms,
        id: opts.config.name,
        serverDirName: opts.serverDirName || '',
        projectDirName: opts.projectDirName || '',
        runtimeExtraProps: opts.runtimeExtraProps || {},
        tasks: createTaskMap<OKey>({
            tasks: [...opts.tasks, ...(opts.extendModules?.flatMap((m) => m.originalTasks) ?? [])],
            ownerID: opts.config.name,
            ownerType: 'engine',
        }),
        getContext,
    };

    return engine;
};
