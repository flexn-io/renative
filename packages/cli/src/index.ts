import program from 'commander';
import fs from 'fs';
import path from 'path';
import { logComplete, logError, getContext, RnvTaskOptionPresets, generateStringFromTaskOption } from '@rnv/core';
import Spinner from './ora';
import Prompt from './prompt';
import Logger from './logger';

//IMPORTANT: Using require instead of import here to avoid circular dependency issue rnv => @rnv/cli => rnv
const { executeRnv } = require('rnv');

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

export const run = () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());
    let cmdValue = '';
    let cmdOption = '';

    program.version(packageJson.version, '-v, --version', 'output current version');

    RnvTaskOptionPresets.withAll().forEach((param) => {
        program.option(generateStringFromTaskOption(param), param.description);
    });

    program.allowUnknownOption(true); // integration options are not known ahead of time

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
    })
        .then(() => {
            logComplete(!getContext().runtime.keepSessionActive);
        })
        .catch((e: unknown) => {
            terminateProcesses();
            logError(e, true);
        });
};
