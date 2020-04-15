import fs from 'fs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import {isMonorepo, getMonorepoRoot} from '../common'
import { removeDirs } from './fileutils';
import { logTask, logToSummary } from './logger';
import { executeAsync } from './exec';

const doCleanPackage = async (c, skipQuestion) => {
    await executeAsync(
        c,
        'rm -rf node_modules package-lock.json yarn.lock .DS_Store || true',
        { shell: true }
    );
};
const doCleanMonorepo = async (c, skipQuestion) => {
    await executeAsync(
        c,
        'npx lerna clean --yes',
        { cwd: getMonorepoRoot(), shell: true }
    );
    await executeAsync(
        c,
        'lerna exec -- rm yarn.lock package-lock.json .DS_Store || true',
        { cwd: getMonorepoRoot(), shell: true }
    );
    await executeAsync(
        c,
        'rm -rf node_modules package-lock.json yarn.lock .DS_Store || true',
        { cwd: getMonorepoRoot(), shell: true }
    );
};
const rnvClean = async (c, skipQuestion = false) => {
    logTask('rnvClean');
    if (c.program.ci) skipQuestion = true;

    const buildDirs = [];
    if (fs.existsSync(c.paths.project.builds.dir)) { buildDirs.push(c.paths.project.builds.dir); }
    if (fs.existsSync(c.paths.project.assets.dir)) { buildDirs.push(c.paths.project.assets.dir); }

    const answers = {
        modules: false,
        builds: false,
        cache: false,
        nothingToClean: !skipQuestion
    };

    if (!skipQuestion) {
        const { confirm } = await inquirer.prompt({
            name: 'confirm',
            type: 'confirm',
            message: `Do you want to remove node_module related files/folders?`
        });
        answers.modules = confirm;
        if (confirm) answers.nothingToClean = false;
    } else {
        answers.modules = true;
    }

    if (buildDirs.length) {
        if (!skipQuestion) {
            const { confirmBuilds } = await inquirer.prompt({
                name: 'confirmBuilds',
                type: 'confirm',
                message: `Do you want to clean your platformBuilds and platformAssets? \n${chalk.red(
                    buildDirs.join('\n')
                )}`
            });
            answers.builds = confirmBuilds;
            if (confirmBuilds) answers.nothingToClean = false;
        } else {
            answers.builds = true;
        }
    }

    if (!skipQuestion) {
        const { confirmCache } = await inquirer.prompt({
            name: 'confirmCache',
            type: 'confirm',
            message: 'Do you want to clean your npm/bundler cache?'
        });
        answers.cache = confirmCache;
        if (confirmCache) answers.nothingToClean = false;
    } else {
        answers.cache = true;
    }

    if (answers.nothingToClean) {
        logToSummary('Nothing to clean');
        return Promise.resolve();
    }

    if (answers.modules) {
        if (isMonorepo()) {
            await doCleanMonorepo(c, skipQuestion);
        }
        else {
            doCleanPackage(c, skipQuestion);
        }
    }
    if (answers.builds) {
        await removeDirs(buildDirs);
    }
    if (answers.cache) {
        await executeAsync(c, 'npx watchman watch-del-all || true', { shell: true });
        await executeAsync(
            c,
            'rm -rf $TMPDIR/metro-* && rm -rf $TMPDIR/react-* && rm -rf $TMPDIR/haste-*'
        );
    }
};

export { rnvClean };
