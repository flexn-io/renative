import path from 'path';
import { build } from 'esbuild';
import { logDebug, logError, logHook, logInfo } from '../logger';
import { fsExistsSync, copyFolderContentsRecursiveSync } from '../system/fs';
import { inquirerPrompt } from '../api';
import { getConfigProp } from '../context/contextProps';
import { getContext } from '../context/provider';
import { RnvFolderName } from '../enums/folderName';

export const executePipe = async (key: string) => {
    const c = getContext();
    logDebug('executePipe', c?.program?.opts()?.json ? key : `('${key}')`);

    await buildHooks();

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

export const buildHooks = async () => {
    logDebug('buildHooks');
    const c = getContext();
    const enableHookRebuild = getConfigProp('enableHookRebuild');

    let shouldBuildHook =
        c.program.opts().reset ||
        c.program.opts().resetHard ||
        c.program.opts().resetAssets ||
        c.program.opts().hooks ||
        !fsExistsSync(c.paths.buildHooks.dist.dir) ||
        enableHookRebuild === true ||
        c.runtime.forceBuildHookRebuild;

    if (
        (!fsExistsSync(c.paths.buildHooks.src.index) &&
            !fsExistsSync(c.paths.buildHooks.src.indexTs) &&
            c.program.opts().ci) ||
        c.runtime.skipBuildHooks
    ) {
        logInfo('No build hooks found and in --ci mode. SKIPPING');
        return true;
    }

    const hasNoIndex = !fsExistsSync(c.paths.buildHooks.src.index) && !fsExistsSync(c.paths.buildHooks.src.indexTs);

    if (hasNoIndex) {
        if (c.program.opts().ci) {
            c.runtime.skipBuildHooks = true;
            return;
        }

        let confirmed;
        if (c.program.opts().yes) {
            confirmed = true;
        } else {
            const { confirm } = await inquirerPrompt({
                type: 'confirm',
                name: 'confirm',
                message: 'Build hooks not configured in this project. Configure?',
            });
            confirmed = confirm;
        }

        if (confirmed) {
            const templatePath = c.paths.template.dir;
            let buildHooksSource = path.join(templatePath, RnvFolderName.buildHooks, 'src');
            // if there is a template and has buildhooks folder, use that instead of the default
            if (fsExistsSync(buildHooksSource)) {
                shouldBuildHook = true;
            } else {
                buildHooksSource = path.join(c.paths.rnvCore.templateFilesDir, 'buildHooksSrc');
            }

            copyFolderContentsRecursiveSync(buildHooksSource, c.paths.buildHooks.src.dir);
        } else {
            c.runtime.skipBuildHooks = true;
            return;
        }
    }

    if (shouldBuildHook && !c.isBuildHooksReady) {
        const indexPath = fsExistsSync(c.paths.buildHooks.src.indexTs)
            ? c.paths.buildHooks.src.indexTs
            : c.paths.buildHooks.src.index;
        try {
            logInfo('Build hooks not complied. BUILDING...');

            await build({
                entryPoints: [indexPath],
                bundle: true,
                platform: 'node',
                logLimit: c.program.opts().json ? 0 : 10,
                external: [
                    '@rnv/core', // exclude rnv core from build
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

    return true;
};
