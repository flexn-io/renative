import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import {
    logError,
    getContext,
    generateStringFromTaskOption,
    RnvTaskCoreOptionPresets,
    RnvContextProgram,
    RnvApiSpinner,
    RnvApiPrompt,
    RnvApiLogger,
    createRnvApi,
    createRnvContext,
    logInitialize,
    loadWorkspacesConfigSync,
    registerEngine,
    executeRnvCore,
    getConfigProp,
    doResolve,
    exitRnvCore,
} from '@rnv/core';
import { Telemetry } from '@rnv/sdk-telemetry';
import EngineCore from '@rnv/engine-core';

import Spinner from './ora';
import Prompt from './prompt';
import Logger, { logSummary } from './logger';

const terminateProcesses = (): void => {
    const { runningProcesses } = getContext();
    try {
        runningProcesses.forEach((p) => {
            p.kill();
        });
    } catch (e) {
        console.log(e);
    }
    runningProcesses.length = 0;
};

export const run = ({ RNV_HOME_DIR }: { RNV_HOME_DIR?: string }) => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());
    let cmdValue = '';
    let cmdOption = '';

    program.version(packageJson.version, '-v, --version', 'output current version');

    RnvTaskCoreOptionPresets.withCore().forEach((param) => {
        program.option(generateStringFromTaskOption(param), param.description);
    });

    program.allowUnknownOption(true); // integration options are not known ahead of time
    program.helpOption(false);

    // Make both arguments optional un order to allow `$ rnv` top level command
    program.arguments('[cmd] [option]').action((cmd, option) => {
        cmdValue = cmd;
        cmdOption = option;
    });

    program.parse(process.argv);

    process.on('SIGINT', () => {
        terminateProcesses();
        process.exit(0);
    });

    // This looks weird but commander default help is actual function.
    // if you pass --help it will override it with undefined
    // So we need to check if it's not a function to output help
    // if (program.opts().help) {
    // console.log('HKJHKDJHKJDHKD');

    //program.outputHelp();
    // Let's use alternative name for this flag
    // program.opts().help = true;
    // }

    // If the first argument is a flag, then the subCommand is missing
    // this occurs when rnv has to execute unknown commands (ie intergration commands)
    // commander does not handle this scenario automatically
    if (cmdOption && (cmdOption.startsWith('--') || cmdOption.startsWith('-'))) {
        cmdOption = '';
    }
    executeRnv({
        cmd: cmdValue,
        subCmd: cmdOption,
        program,
        process,
        spinner: Spinner,
        prompt: Prompt,
        logger: Logger,
        RNV_HOME_DIR,
    })
        .then(() => {
            logSummary();
            exitRnvCore(0);
        })
        .catch((e: unknown) => {
            terminateProcesses();
            logError(e);
            logSummary();
            exitRnvCore(1);
        });
};

export const executeRnv = async ({
    cmd,
    subCmd,
    process,
    program,
    spinner,
    prompt,
    logger,
    RNV_HOME_DIR,
}: {
    cmd: string;
    subCmd: string;
    process: NodeJS.Process;
    program: RnvContextProgram;
    spinner: RnvApiSpinner;
    prompt: RnvApiPrompt;
    logger: RnvApiLogger;
    RNV_HOME_DIR?: string;
}) => {
    // set mono and ci if json is enabled
    if (program.opts().json) {
        program.opts().mono = true;
        program.opts().ci = true;
    }

    createRnvApi({ spinner, prompt, analytics: Telemetry, logger, getConfigProp, doResolve });
    createRnvContext({ program, process, cmd, subCmd, RNV_HOME_DIR });

    logInitialize();
    loadWorkspacesConfigSync();

    Telemetry.initialize();

    await registerEngine(EngineCore);

    await executeRnvCore();
};
