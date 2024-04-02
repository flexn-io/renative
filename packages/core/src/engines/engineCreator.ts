import { generateRnvTaskMap } from '../tasks/taskHelpers';
import { RnvTask } from '../tasks/types';
import type { CreateRnvEngineOpts, RnvEngine } from './types';

export const createRnvEngine = <T extends RnvEngine>(opts: CreateRnvEngineOpts) => {
    const engine: T = { ...opts, tasks: generateRnvTaskMap<T['tasks']>(opts.tasks, opts.config) };
    return engine;
};
