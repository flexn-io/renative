import { installPackageDependencies } from './npm';
import { logInfo, logDefault, logWarning } from '../logger';
import { fsExistsSync } from '../system/fs';
import { getContext } from '../context/provider';
import { DependencyMutation } from './types';

export const checkIfProjectAndNodeModulesExists = async () => {
    logDefault('checkIfProjectAndNodeModulesExists');

    const c = getContext();

    if (c.paths.project.configExists && !fsExistsSync(c.paths.project.nodeModulesDir)) {
        c._requiresNpmInstall = false;
        logInfo('node_modules folder is missing. INSTALLING...');
        await installPackageDependencies();
    }
};

export const createDependencyMutation = (opts: DependencyMutation) => {
    return opts;
};

export const handleMutations = async (mutations: DependencyMutation[]) => {
    const c = getContext();
    if (!mutations.length) return true;
    logWarning('Dependency conflicts detected. Please resolve them before continuing');
    mutations.forEach((m) => {
        logWarning(`- ${m.name} ${m.msg} (${m.original?.version || 'N/A'}) => (${m.updated.version})`);
    });
    const isTemplate = c.buildConfig?.isTemplate;
    if (isTemplate) return true;
    //Check with user
    return false;
};
