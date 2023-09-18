// import semver from 'semver';
import path from 'path';
import inquirer from 'inquirer';
import { executeAsync, commandExistsSync } from '../system/exec';
import {
    fsExistsSync,
    invalidatePodsChecksum,
    removeDirs,
    writeFileSync,
    fsWriteFileSync,
    loadFile,
    readObjectSync,
} from '../system/fs';
import { logTask, logWarning, logError, logInfo, logDebug, logSuccess } from '../logger';
import { ANDROID, ANDROID_TV, FIRE_TV, ANDROID_WEAR, RENATIVE_CONFIG_TEMPLATE_NAME } from '../constants';
import { doResolve } from '../system/resolve';

import { getConfigProp } from '../common';
import { RnvContext } from '../context/types';
import { inquirerPrompt } from '../api';

const packageJsonIsValid = (c: RnvContext) => {
    if (!fsExistsSync(c.paths.project.package)) return false;
    const pkg = readObjectSync(c.paths.project.package);
    if (!pkg) return false;
    // yarn add creates a package.json with only dependencies, that is not valid
    if (Object.keys(pkg).length === 1 && Object.keys(pkg)[0] === 'dependencies') return false;
    return true;
};

export const checkNpxIsInstalled = async () => {
    logTask('checkNpxIsInstalled');
    if (!commandExistsSync('npx')) {
        logWarning('npx is not installed, please install it before running this command');

        const { confirm } = await inquirerPrompt({
            type: 'confirm',
            message: 'Do you want to install npx it now?',
        });

        if (confirm) {
            await executeAsync('npm install -g npx');
            return true;
        }

        throw new Error('npx is not installed');
    }
};

export const checkAndCreateProjectPackage = async (c: RnvContext) => {
    logTask('checkAndCreateProjectPackage');

    if (!packageJsonIsValid(c)) {
        logInfo(`Your ${c.paths.project.package} is missing. CREATING...DONE`);

        const packageName = c.files.project.config.projectName || c.paths.project.dir.split('/').pop();
        const version = c.files.project.config.defaults?.package?.version || '0.1.0';
        const templateName = c.files.project.config?.currentTemplate;
        if (!templateName) {
            logWarning('You are missing currentTemplate in your renative.json');
        }
        const rnvVersion = c.files.rnv.package.version;

        c.paths.template.configTemplate = path.join(
            c.paths.project.dir,
            'node_modules',
            templateName,
            RENATIVE_CONFIG_TEMPLATE_NAME
        );

        const templateObj = readObjectSync(c.paths.template.configTemplate);

        const pkgJson = templateObj?.templateConfig?.packageTemplate || {};
        pkgJson.name = packageName;
        pkgJson.version = version;
        pkgJson.dependencies = pkgJson.dependencies || {};
        // No longer good option to assume same version
        // pkgJson.dependencies.renative = rnvVersion;
        pkgJson.devDependencies = pkgJson.devDependencies || {};
        pkgJson.devDependencies.rnv = rnvVersion;

        pkgJson.devDependencies[templateName] = c.files.project.config?.templates[templateName]?.version;
        const pkgJsonStringClean = JSON.stringify(pkgJson, null, 2);
        fsWriteFileSync(c.paths.project.package, pkgJsonStringClean);
    }

    loadFile(c.files.project, c.paths.project, 'package');

    return true;
};

export const areNodeModulesInstalled = () => !!doResolve('resolve', false);

export const listAndSelectNpmVersion = async (c: RnvContext, npmPackage: string) => {
    const templateVersionsStr = await executeAsync(c, `npm view ${npmPackage} versions`);
    const versionArr = templateVersionsStr.replace(/\r?\n|\r|\s|'|\[|\]/g, '').split(',');

    const templateTagsStr = await executeAsync(c, `npm dist-tag ls ${npmPackage}`);
    const tagArr: Array<{
        name: string;
        version: string;
    }> = [];
    templateTagsStr.split('\n').forEach((tString) => {
        const tArr = tString.split(': ');
        tagArr.push({
            name: tArr[0],
            version: tArr[1],
        });
    });

    versionArr.reverse();
    const validVersions = versionArr.map((v: string) => ({ name: v, value: v }));

    let recommendedVersion;
    validVersions.forEach((item) => {
        let matchStr = '';
        const matchArr: Array<string> = [];
        tagArr.forEach((tag) => {
            if (tag.version === item.value) {
                matchArr.push(tag.name);
            }
        });
        if (matchArr.length) {
            matchStr = ` (HEAD: ${matchArr.join(', ')})`;
            item.name = `${item.value}${matchStr}`;
            if (matchArr[0] === 'latest') {
                recommendedVersion = item;
            }
        }
    });
    if (!recommendedVersion) {
        recommendedVersion = validVersions[0];
    }

    const { inputTemplateVersion } = await inquirer.prompt({
        name: 'inputTemplateVersion',
        type: 'list',
        message: `What ${npmPackage} version to use?`,
        default: recommendedVersion.value,
        loop: false,
        choices: validVersions,
    });

    return inputTemplateVersion;
};

export const checkIfProjectAndNodeModulesExists = async (c: RnvContext) => {
    logTask('checkIfProjectAndNodeModulesExists');

    if (c.paths.project.configExists && !fsExistsSync(c.paths.project.nodeModulesDir)) {
        c._requiresNpmInstall = false;
        logInfo('node_modules folder is missing. INSTALLING...');
        await installPackageDependencies(c);
    }
};

const _getInstallScript = (c: RnvContext) => {
    const tasks = c.buildConfig?.tasks;
    if (!tasks) return null;
    if (Array.isArray(tasks)) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].name === 'install') {
                return tasks[i].script;
            }
        }
    } else {
        return tasks.install?.script;
    }
};

export const isYarnInstalled = () => commandExistsSync('yarn') || doResolve('yarn', false);

export const installPackageDependencies = async (c: RnvContext, failOnError = false) => {
    c.runtime.forceBuildHookRebuild = true;
    const customScript = _getInstallScript(c);

    if (customScript) {
        logTask('installPackageDependencies');
        logInfo(`Found custom task for install: ${customScript}.`);
        await executeAsync(customScript);
        c._requiresNpmInstall = false;
        return true;
    }

    const isMonorepo = getConfigProp(c, c.platform, 'isMonorepo');
    if (isMonorepo) {
        logSuccess(
            'This project is marked as part of monorepo and it has no custom install tasks. Run your usual monorepo bootstrap procedure and re-run command again.'
        );
        return Promise.reject('Cancelled');
    }

    const yarnLockPath = path.join(c.paths.project.dir, 'yarn.lock');
    const npmLockPath = path.join(c.paths.project.dir, 'package-lock.json');
    let command = 'npm install';

    const yarnLockExists = fsExistsSync(yarnLockPath);
    const packageLockExists = fsExistsSync(npmLockPath);

    if (yarnLockExists || packageLockExists) {
        // a lock file exists, defaulting to whichever is present
        if (yarnLockExists && !isYarnInstalled())
            throw new Error(
                "You have a yarn.lock file but you don't have yarn installed. Install it or delete yarn.lock"
            );
        command = yarnLockExists ? 'yarn' : 'npm install';
    } else if (c.program.packageManager) {
        // no lock file check cli option
        if (['yarn', 'npm'].includes(c.program.packageManager)) {
            command = c.program.packageManager === 'yarn' ? 'yarn' : 'npm install';
            if (command === 'yarn' && !isYarnInstalled())
                throw new Error("You specified yarn as packageManager but it's not installed");
        } else {
            throw new Error(
                `Unsupported package manager ${c.program.packageManager}. Only yarn and npm are supported at the moment.`
            );
        }
    } else {
        // no cli option either, asking
        const { packageManager } = await inquirerPrompt({
            type: 'list',
            name: 'packageManager',
            message: 'What package manager would you like to use?',
            choices: ['yarn', 'npm'],
            default: 'npm',
        });
        if (packageManager === 'yarn') command = 'yarn';
    }

    logTask('installPackageDependencies', `packageManager:(${command})`);

    try {
        await executeAsync(command);
        await invalidatePodsChecksum(c);
    } catch (e: any) {
        if (failOnError) {
            logError(e);
            throw e;
        }
        logWarning(
            `${e}\n Seems like your node_modules is corrupted by other libs. ReNative will try to fix it for you`
        );
        try {
            await cleanNodeModules();
            await installPackageDependencies(c, true);
        } catch (npmErr: any) {
            logError(npmErr);
            throw npmErr;
        }
    }
    try {
        const plats = c.files.project.config?.defaults?.supportedPlatforms;
        if (
            Array.isArray(plats) &&
            (plats.includes(ANDROID) ||
                plats.includes(ANDROID_TV) ||
                plats.includes(FIRE_TV) ||
                plats.includes(ANDROID_WEAR))
        ) {
            if (!c.files.project.configLocal) {
                c.files.project.configLocal = {};
            }
            if (!c.files.project.configLocal?._meta) {
                c.files.project.configLocal._meta = {};
            }
            c.files.project.configLocal._meta.requiresJetify = true;
            writeFileSync(c.paths.project.configLocal, c.files.project.configLocal);
        }
        c._requiresNpmInstall = false;
        return true;
    } catch (jetErr: any) {
        logError(jetErr);
        return false;
    }
};

export const jetifyIfRequired = async (c: RnvContext) => {
    logTask('jetifyIfRequired');
    if (c.files.project.configLocal?._meta?.requiresJetify) {
        if (doResolve('jetifier')) {
            await executeAsync('npx jetify');
            c.files.project.configLocal._meta.requiresJetify = false;
            writeFileSync(c.paths.project.configLocal, c.files.project.configLocal);
        }
    }
    return true;
};

export const cleanNodeModules = () =>
    new Promise<void>((resolve, reject) => {
        logTask('cleanNodeModules');
        const dirs = [
            'react-native-safe-area-view/.git',
            '@react-navigation/native/node_modules/react-native-safe-area-view/.git',
            'react-navigation/node_modules/react-native-safe-area-view/.git',
            'react-native-safe-area-view/.git',
            '@react-navigation/native/node_modules/react-native-safe-area-view/.git',
            'react-navigation/node_modules/react-native-safe-area-view/.git',
        ].reduce<Array<string>>((acc, dir) => {
            const res = dir.match(/([^/]+)\/(.*)/);
            if (res) {
                const [_all, aPackage, aPath] = res;
                logDebug(`Cleaning: ${_all}`);
                const resolved = doResolve(aPackage, false);
                if (resolved) {
                    acc.push(`${resolved}/${aPath}`);
                }
            }

            return acc;
        }, []);
        removeDirs(dirs)
            .then(() => resolve())
            .catch((e) => reject(e));
        // removeDirs([
        //     path.join(c.paths.project.nodeModulesDir, 'react-native-safe-area-view/.git'),
        //     path.join(c.paths.project.nodeModulesDir, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        //     path.join(c.paths.project.nodeModulesDir, 'react-navigation/node_modules/react-native-safe-area-view/.git'),
        //     path.join(c.paths.rnv.nodeModulesDir, 'react-native-safe-area-view/.git'),
        //     path.join(c.paths.rnv.nodeModulesDir, '@react-navigation/native/node_modules/react-native-safe-area-view/.git'),
        //     path.join(c.paths.rnv.nodeModulesDir, 'react-navigation/node_modules/react-native-safe-area-view/.git')
        // ]).then(() => resolve()).catch(e => reject(e));
    });
