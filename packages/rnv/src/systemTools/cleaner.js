import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { removeDirs } from './fileutils';
import { logTask, logToSummary } from './logger';
import { executeAsync } from './exec';

const rnvClean = async (c, skipQuestion = false) => {
    logTask('rnvClean');
    if (c.program.ci) skipQuestion = true;
    const pathsToRemove = [];
    if (fs.existsSync(c.paths.project.nodeModulesDir)) pathsToRemove.push(c.paths.project.nodeModulesDir);
    const pkgLock = path.join(c.paths.project.dir, 'package-lock.json');
    if (fs.existsSync(pkgLock)) pathsToRemove.push(pkgLock);
    let msg = chalk.red(`${c.paths.project.nodeModulesDir}\n${pkgLock}\n`);
    const packagesFolder = path.join(c.paths.project.dir, 'packages');
    if (fs.existsSync(packagesFolder)) {
        fs.readdirSync(packagesFolder).forEach((dir) => {
            if (dir === '.DS_Store') {
                const pth = path.join(packagesFolder, dir);

                if (fs.existsSync(pth)) {
                    pathsToRemove.push(pth);
                    msg += chalk.red(`${pth}\n`);
                }
            } else {
                const pth2 = path.join(packagesFolder, dir, 'node_modules');
                if (fs.existsSync(pth2)) {
                    pathsToRemove.push(pth2);
                    msg += chalk.red(`${pth2}\n`);
                }

                const pth3 = path.join(packagesFolder, dir, 'package-lock.json');
                if (fs.existsSync(pth3)) {
                    pathsToRemove.push(pth3);
                    msg += chalk.red(`${pth3}\n`);
                }
            }
        });
    }

    const buildDirs = [];
    if (fs.existsSync(c.paths.project.builds.dir)) buildDirs.push(c.paths.project.builds.dir);
    if (fs.existsSync(c.paths.project.assets.dir)) buildDirs.push(c.paths.project.assets.dir);

    const answers = {
        modules: false,
        builds: false,
        cache: false,
        nothingToClean: !skipQuestion
    };

    if (pathsToRemove.length) {
        if (!skipQuestion) {
            const { confirm } = await inquirer.prompt({
                name: 'confirm',
                type: 'confirm',
                message: `Do you want to remove node_module related files/folders? \n${msg}`,
            });
            answers.modules = confirm;
            if (confirm) answers.nothingToClean = false;
        } else {
            answers.modules = true;
        }
    }

    if (buildDirs.length) {
        if (!skipQuestion) {
            const { confirmBuilds } = await inquirer.prompt({
                name: 'confirmBuilds',
                type: 'confirm',
                message: `Do you want to clean your platformBuilds and platformAssets? \n${chalk.red(buildDirs.join('\n'))}`,
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
            message: 'Do you want to clean your npm/bundler cache?',
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
        await removeDirs(pathsToRemove);
    }
    if (answers.builds) {
        await removeDirs(buildDirs);
    }
    if (answers.cache) {
        await executeAsync(c, 'watchman watch-del-all');
        await executeAsync(c, 'rm -rf $TMPDIR/metro-* && rm -rf $TMPDIR/react-* && rm -rf $TMPDIR/haste-*');
    }
};

export { rnvClean };
