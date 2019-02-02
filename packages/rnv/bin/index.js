#!/usr/bin/env node
const program = require('commander');

global.fetch = require('node-fetch');

global.Headers = global.fetch.Headers;

const cli = require('../dist/index.js');


program
    .version('0.1.0')
    .option('-I, --info', 'Add peppers')
    .arguments('<cmd> [option]')
    .action((cmd, option) => {
        cmdValue = cmd;
        cmdOption = option;
    });

program.parse(process.argv);

if (typeof cmdValue === 'undefined') {
    console.error('no command given!');
    process.exit(1);
}
// console.log('command:', cmdValue, cmdOption, program);

cli.default.run(cmdValue, cmdOption, program, process.argv);
