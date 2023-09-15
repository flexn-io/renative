#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');

import { Constants } from 'rnv';
// global.fetch = require('node-fetch');
// global.fetch = await import('node-fetch');

// global.Headers = global.fetch.Headers;

import cli from './cli';

export const run = () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
    let cmdValue = '';
    let cmdOption = '';

    program.version(packageJson.version, '-v, --version', 'output current version');

    Constants.PARAMS.withAll().forEach((param: any) => {
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

    cli.run(cmdValue, cmdOption, program, process);
};
