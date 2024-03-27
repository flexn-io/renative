import { logInfo, logWarning } from '../logger';
import { getContext } from '../context/provider';
import { DependencyMutation } from './types';

export const createDependencyMutation = (opts: DependencyMutation) => {
    const ctx = getContext();
    ctx.mutations.pendingMutations.push(opts);
    return opts;
};

export const handleMutations = async () => {
    const ctx = getContext();
    const mutations = ctx.mutations.pendingMutations;
    if (!mutations.length) return true;
    logWarning('Dependency conflicts detected. Please resolve them before continuing');
    mutations.forEach((m) => {
        logInfo(`- ${m.name} ${m.msg} (${m.original?.version || 'N/A'}) => (${m.updated.version})`);
    });
    const isTemplate = ctx.buildConfig?.isTemplate;
    console.log('DJDJDJJDJDJD', mutations);

    if (isTemplate) return true;
    //Check with user
    return false;
};
