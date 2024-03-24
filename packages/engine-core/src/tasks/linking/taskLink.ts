import {
    logInfo,
    logTask,
    fsExistsSync,
    fsRenameSync,
    fsSymlinkSync,
    RnvTaskFn,
    RnvTask,
    RnvTaskName,
    mkdirSync,
    chalk,
    fsUnlinkSync,
    removeDirSync,
    inquirerPrompt,
} from '@rnv/core';
import { LinkablePackage } from './types';
import { getSourceDir, traverseTargetProject } from './linker';

const _linkPackage = (pkg: LinkablePackage) => {
    if (!fsExistsSync(pkg.cacheDir)) {
        mkdirSync(pkg.cacheDir);
    }

    if (pkg.isBrokenLink) {
        logInfo(`${pkg.name} is a ${chalk().red('broken')} link. Attempting to fix...`);
        fsUnlinkSync(pkg.nmPath);
    } else if (pkg.isLinked) {
        logInfo(`${pkg.name} is already linked. SKIPPING`);
    } else if (pkg.skipLinking) {
        logInfo(`${pkg.name} is set to skip linking. SKIPPING`);
    } else if (pkg.nmPathExists) {
        if (pkg.unlinkedPathExists) {
            logInfo(`${pkg.name} found in exisitng cache. Removing and relinking...`);
            removeDirSync(pkg.unlinkedPath);
        }
        mkdirSync(pkg.unlinkedPath);
        fsRenameSync(pkg.nmPath, pkg.unlinkedPath);
        fsSymlinkSync(pkg.sourcePath, pkg.nmPath);
        logInfo(`${chalk().green('✔')} ${pkg.name} (${chalk().gray(pkg.nmPath)})`);
    } else if (pkg.unlinkedPathExists) {
        logInfo(`${pkg.name} found in unlinked cache. Attempting to relink...`);
        fsSymlinkSync(pkg.sourcePath, pkg.nmPath);
        logInfo(`${pkg.name} => link => ${chalk().green('SUCCESS')} (${chalk().gray(pkg.nmPath)})`);
    }
};

const runtimeLibs = ['@rnv/renative'];

const fn: RnvTaskFn = async () => {
    logTask('taskLink');

    const linkablePackages = traverseTargetProject(getSourceDir());

    let msg = 'Found following source packages:\n\n';

    const choices: { name: string; value: LinkablePackage }[] = [];

    linkablePackages.forEach((pkg) => {
        const title = `${pkg.nmPath.replace(pkg.name, chalk().bold(pkg.name))} ${
            pkg.isBrokenLink ? chalk().red('(broken)') : pkg.isLinked ? chalk().green('(linked)') : '(unlinked)'
        }\n`;

        msg += title;
        const addon = runtimeLibs.includes(pkg.name)
            ? chalk().yellow(' (Runtime lib. will not work with react-native)')
            : '';

        choices.push({ name: `${pkg.name}${addon}`, value: pkg });
    });

    logInfo(msg);

    const slpDefaults = linkablePackages.filter((pkg) => !runtimeLibs.includes(pkg.name));

    const { selectedLinkableProjects } = await inquirerPrompt({
        name: 'selectedLinkableProjects',
        type: 'checkbox',
        message: `Found following packages to link?`,
        default: slpDefaults,
        loop: false,
        choices,
    });

    logInfo('Linking packages...');
    selectedLinkableProjects.forEach((pkg: LinkablePackage) => {
        _linkPackage(pkg);
    });

    return true;
};

const Task: RnvTask = {
    description: 'Links development version or renative with this project',
    fn,
    task: RnvTaskName.link,
    options: [{ key: 'dir', description: 'Source folder to be linked into project', isValueType: true }],
    isGlobalScope: true,
    ignoreEngines: true,
};

export default Task;
