import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { removeDirs } from './fileutils';
import { logTask, logToSummary } from './logger';

const rnvClean = async (c, skipQuestion = false) => {
    logTask('rnvClean');
    const pathsToRemove = [
        c.paths.project.nodeModulesDir,
        path.join(c.paths.project.dir, 'package-lock.json')
    ];
    let msg = chalk.red('./node_modules\n./package-lock.json\n');
    const packagesFolder = path.join(c.paths.project.dir, 'packages');
    if (fs.existsSync(packagesFolder)) {
        fs.readdirSync(packagesFolder).forEach((dir) => {
            if (dir === '.DS_Store') {
                const pth = path.join(packagesFolder, dir);

                if (fs.existsSync(pth)) {
                    pathsToRemove.push(pth);
                    msg += chalk.red(`./packages/${dir}\n`);
                }
            } else {
                const pth2 = path.join(packagesFolder, dir, 'node_modules');
                if (fs.existsSync(pth2)) {
                    pathsToRemove.push(pth2);
                    msg += chalk.red(`./packages/${dir}/node_modules\n`);
                }

                const pth3 = path.join(packagesFolder, dir, 'package-lock.json');
                if (fs.existsSync(pth3)) {
                    pathsToRemove.push(pth3);
                    msg += chalk.red(`./packages/${dir}/package-lock.json\n`);
                }
            }
        });
    }

    if (pathsToRemove) {
        logToSummary('Nothing to clean');
        return Promise.resolve();
    }


    if (skipQuestion) {
        return removeDirs(pathsToRemove);
    }

    const { confirm } = await inquirer.prompt({
        name: 'confirm',
        type: 'confirm',
        message: `Are you sure you want to remove these files/folders? \n${msg}`,
    });

    if (confirm) {
        await removeDirs(pathsToRemove);

        const buildDirs = [
            c.paths.project.builds.dir,
            c.paths.project.assets.dir
        ];
        const { confirmBuilds } = await inquirer.prompt({
            name: 'confirmBuilds',
            type: 'confirm',
            message: `Do you also want to clean your platformBuilds and platformAssets? \n${chalk.red(buildDirs.join('\n'))}`,
        });
        if (confirmBuilds) {
            await removeDirs(buildDirs);
        }
    }
};

export { rnvClean };
