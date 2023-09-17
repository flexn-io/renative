import program from 'commander';
import fs from 'fs';
import path from 'path';
import {
    configureRuntimeDefaults,
    updateRenativeConfigs,
    registerEngine,
    registerMissingPlatformEngines,
    loadEngines,
    checkAndMigrateProject,
    checkAndBootstrapIfRequired,
    loadIntegrations,
    initializeTask,
    findSuitableTask,
    RnvContext,
    logComplete,
    logError,
    Context,
    PARAMS,
} from '@rnv/core';
import { initializeRnv } from 'rnv';
import Spinner from './ora';
import Prompt from './prompt';

const IGNORE_MISSING_ENGINES_TASKS = ['link', 'unlink'];

const CLI = async (c: RnvContext) => {
    c.spinner = Spinner;
    c.prompt = Prompt;
    const EngineCore = require('@rnv/engine-core').default;

    await registerEngine(c, EngineCore);
    await configureRuntimeDefaults(c);
    await checkAndMigrateProject();
    await updateRenativeConfigs(c);
    await checkAndBootstrapIfRequired(c);
    if (c.program.npxMode) {
        return;
    }
    await loadIntegrations(c);
    const result = await loadEngines(c);
    // If false make sure we reload configs as it's freshly installed
    if (!result) {
        await updateRenativeConfigs(c);
    }
    // for root rnv we simply load all engines upfront
    if (!c.command && c.paths.project.configExists) {
        await registerMissingPlatformEngines(c);
    }
    const taskInstance = await findSuitableTask(c);
    // Some tasks might require all engines to be present (ie rnv platforms list)
    if (c.command && !IGNORE_MISSING_ENGINES_TASKS.includes(c.command)) {
        await registerMissingPlatformEngines(c, taskInstance);
    }
    // Skip babel.config creation until template check
    // await checkAndCreateBabelConfig(c);
    if (taskInstance?.task) await initializeTask(c, taskInstance?.task);
};

export const run = () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());
    let cmdValue = '';
    let cmdOption = '';

    program.version(packageJson.version, '-v, --version', 'output current version');

    PARAMS.withAll().forEach((param: any) => {
        let cmd = '';
        if (param.shortcut) {
            cmd += `-${param.shortcut}, `;
        }
        cmd += `--${param.key}`;
        if (param.value) {
            if (param.isRequired) {
                cmd += ` <${param.value}>`;
            } else if (param.variadic) {
                cmd += ` [${param.value}...]`;
            } else {
                cmd += ` [${param.value}]`;
            }
        }
        program.option(cmd, param.description);
    });

    program.arguments('<cmd> [option]').action((cmd: any, option: any) => {
        cmdValue = cmd;
        cmdOption = option;
    });

    program.parse(process.argv);

    initializeRnv(cmdValue, cmdOption, program, process)
        .then((c) => Context.initializeConfig(c))
        .then((c) => CLI(c))
        .then(() => logComplete(!Context.getContext().runtime.keepSessionActive))
        .catch((e) => logError(e, true));
};
