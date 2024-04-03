import { chalk, logRaw, logWarning } from '../logger';
import { getContext } from '../context/provider';
import { DependencyMutation } from './types';
import { inquirerPrompt } from '../api';
import { NpmPackageFile } from '../configs/types';
import { updatePackage } from './package';

export const createDependencyMutation = (opts: DependencyMutation) => {
    const ctx = getContext();
    ctx.mutations.pendingMutations.push(opts);
    ctx._requiresNpmInstall = true;
    return opts;
};

export const handleMutations = async () => {
    const ctx = getContext();
    const mutations = ctx.mutations.pendingMutations;
    if (!mutations.length) return true;
    const isTemplate = ctx.buildConfig?.isTemplate;
    logWarning(
        `Updates to package.json are required:${isTemplate ? ' (only info. skipping due to template mode)' : ''}`
    );
    let msg = '';
    mutations.forEach((m) => {
        msg += `- ${chalk().bold(m.name)} (${chalk().red(m.original?.version || 'N/A')}) => (${chalk().green(
            m.updated.version
        )}) ${chalk().gray(`${m.msg} | ${m.source}`)}\n`;
    });
    logRaw(msg);
    if (isTemplate) return false;
    //Check with user
    const choices = [
        'Update package and install (recommended)',
        'Update package and skip install',
        'Continue without update or install',
    ];
    const { confirm } = await inquirerPrompt({
        name: 'confirm',
        type: 'list',
        default: choices[0],
        choices,
        message: 'What to do?',
    });

    ctx.mutations.pendingMutations = [];

    if (confirm === choices[2]) {
        // We skip the update and tell up stream to skip install
        return false;
    }

    const updateObj: Partial<NpmPackageFile> = {};
    mutations.forEach((m) => {
        updateObj[m.type] = updateObj[m.type] || {};
        const dep = updateObj[m.type];
        if (dep) {
            dep[m.name] = m.updated.version;
        }
    });

    updatePackage(updateObj);

    if (confirm === choices[1]) {
        // We update package but tell up stream to skip install
        return false;
    }

    return true;
};
