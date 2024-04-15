import { generateEngineExtensions } from '.';
import { getContext } from '../context/provider';
import { RnvModule } from '../modules/types';
import { createTaskMap } from '../tasks/creators';
import { RnvPlatformKey } from '../types';
import { extractEngineId } from './nameExtractor';
import type { CreateRnvEngineOpts, RnvEngine, RnvEnginePlatforms } from './types';

export const createRnvEngine = <OKey extends string, Modules extends [RnvModule<OKey>, ...RnvModule<OKey>[]]>(
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

    // const em = opts.extendModules || [];
    // const t = (index: number) => {
    //     return em[index]?.originalTasks || [];
    // };
    //     let total = [0, 1, 2, 3].reduce((accumulator, currentValue) => accumulator + currentValue);
    // console.log(total);
    // const extraTasks: ReadonlyArray<RnvTask<OKey>> = [
    //     ...t(0),
    //     ...t(1),
    //     ...t(2),
    //     ...t(3),
    //     ...t(4),
    //     ...t(5),
    //     ...t(6),
    //     ...t(7),
    //     ...t(8),
    //     ...t(9),
    //     ...t(10),
    //     ...t(11),
    //     ...t(12),
    //     ...t(13),
    // ];

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
