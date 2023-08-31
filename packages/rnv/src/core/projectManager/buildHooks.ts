import inquirer from 'inquirer';
import path from 'path';
import { build } from 'esbuild';
import { logDebug, logError, logHook, logInfo } from '../systemManager/logger';
import { fsExistsSync, copyFolderContentsRecursiveSync } from '../systemManager/fileutils';
import { getConfigProp } from '../common';
import { doResolve } from '../systemManager/resolve';
import { RnvConfig } from '../configManager/types';

export const executePipe = async (c: RnvConfig, key: string) => {
    logHook('executePipe', c?.program?.json ? key : `('${key}')`);

    await buildHooks(c);

    const pipes = c.buildPipes ? c.buildPipes[key] : null;

    if (Array.isArray(pipes)) {
        await pipes.reduce((accumulatorPromise: any, next) => {
            logHook(`buildHook.${next?.name}`, '(EXECUTING)');
            return accumulatorPromise.then(() => next(c));
        }, Promise.resolve());
    } else if (pipes) {
        logError(`buildPipes is not an Array!`);
    }
};

export const buildHooks = async (c: RnvConfig) => {
    logDebug('buildHooks');

    const enableHookRebuild = getConfigProp(c, c.platform, 'enableHookRebuild');

    let shouldBuildHook =
        c.program.reset ||
        c.program.resetHard ||
        c.program.resetAssets ||
        c.program.hooks ||
        !fsExistsSync(c.paths.buildHooks.dist.dir) ||
        enableHookRebuild === true ||
        c.runtime.forceBuildHookRebuild;

    if ((!fsExistsSync(c.paths.buildHooks.index) && c.program.ci) || c.runtime.skipBuildHooks) {
        logInfo('No build hooks found and in --ci mode. SKIPPING');
        return true;
    }

    if (!fsExistsSync(c.paths.buildHooks.index)) {
        if (c.program.ci) {
            c.runtime.skipBuildHooks = true;
            return;
        }

        let confirmed;
        if (c.program.yes) {
            confirmed = true;
        } else {
            const { confirm } = await inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: 'Build hooks not configured in this project. Configure?',
            });
            confirmed = confirm;
        }

        if (confirmed) {
            const templatePath = c.buildConfig.currentTemplate ? doResolve(c.buildConfig.currentTemplate) : null;
            let buildHooksSource;
            // if there is a template and has buildhooks folder, use that instead of the default
            if (templatePath && fsExistsSync(`${templatePath}/buildHooks/src/index.js`)) {
                buildHooksSource = path.join(templatePath, 'buildHooks/src');
                shouldBuildHook = true;
            } else {
                buildHooksSource = path.join(c.paths.rnv.dir, 'coreTemplateFiles/buildHooks/src');
            }

            copyFolderContentsRecursiveSync(buildHooksSource, c.paths.buildHooks.dir);
        } else {
            c.runtime.skipBuildHooks = true;
            return;
        }
    }

    if (!c.runtime.isFirstRunAfterNew && !c.files.project.config?.isNew) {
        if (shouldBuildHook && !c.isBuildHooksReady) {
            try {
                logHook('buildHooks', 'Build hooks not complied. BUILDING...');
                await build({
                    entryPoints: [`${c.paths.buildHooks.dir}/index.js`],
                    bundle: true,
                    platform: 'node',
                    logLimit: c.program.json ? 0 : 10,
                    external: [
                        ...Object.keys(c.files.project.package.dependencies || {}),
                        ...Object.keys(c.files.project.package.devDependencies || {}),
                    ], // exclude everything that's present in node_modules
                    outfile: `${c.paths.buildHooks.dist.dir}/index.js`,
                });
            } catch (e) {
                // Fail Builds instead of warn when hook fails
                return Promise.reject(`BUILD_HOOK Failed with error: ${e}`);
            }
            c.isBuildHooksReady = true;
        }

        let h = require(c.paths.buildHooks.dist.index);

        c.buildHooks = h.hooks;
        c.buildPipes = h.pipes;
        h = require(c.paths.buildHooks.dist.index);
    }

    return true;
};
