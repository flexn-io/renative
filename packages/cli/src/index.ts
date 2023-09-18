import program from 'commander';
import fs from 'fs';
import path from 'path';
import { logComplete, logError, Context, PARAMS } from '@rnv/core';
import { executeRnv } from 'rnv';
import Spinner from './ora';
import Prompt from './prompt';

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

    executeRnv({ cmd: cmdValue, subCmd: cmdOption, program, process, spinner: Spinner, prompt: Prompt })
        .then(() => logComplete(!Context.getContext().runtime.keepSessionActive))
        .catch((e) => logError(e, true));
};
