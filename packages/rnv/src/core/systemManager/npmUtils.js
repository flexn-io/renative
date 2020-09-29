import semver from 'semver';
import inquirer from 'inquirer';
import { executeAsync, installPackageDependencies } from './exec';
import { fsExistsSync } from './fileutils';
import { logTask, logWarning } from './logger';

export const listAndSelectNpmVersion = async (c, npmPackage) => {
    const templateVersionsStr = await executeAsync(
        c,
        `npm view ${npmPackage} versions`
    );
    const versionArr = templateVersionsStr
        .replace(/\r?\n|\r|\s|'|\[|\]/g, '')
        .split(',')
        .reverse();
    const { rnvVersion } = c;

    // filter greater versions than rnv
    const validVersions = versionArr
        .filter(version => semver.lte(version, rnvVersion))
        .map(v => ({ name: v, value: v }));
    if (validVersions[0].name === rnvVersion) {
        // mark the same versions as recommended
        validVersions[0].name = `${validVersions[0].name} (recommended)`;
    }

    const { inputTemplateVersion } = await inquirer.prompt({
        name: 'inputTemplateVersion',
        type: 'list',
        message: `What ${npmPackage} version to use?`,
        default: versionArr[0],
        choices: validVersions
    });

    return inputTemplateVersion;
};

export const checkIfProjectAndNodeModulesExists = async (c) => {
    logTask('checkIfProjectAndNodeModulesExists');

    if (c.paths.project.configExists && !fsExistsSync(c.paths.project.nodeModulesDir)) {
        c._requiresNpmInstall = false;
        logWarning(
            'Looks like your node_modules folder is missing. INSTALLING...'
        );
        await installPackageDependencies(c);
    }
};
