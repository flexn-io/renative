#!/usr/bin/env node
const program = require('commander');
const fs = require('fs')
const path = require('path')

global.fetch = require('node-fetch');

global.Headers = global.fetch.Headers;

const cli = require('../dist/index.js');
const package = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json')));


program
    .version(package.version)
    .option('-i, --info', 'Show full debug info')
    .option('-u, --update', 'Force update dependencies (iOS only)')
    .option('-p, --platform <value>', 'Select specific platform') // <ios|android|web|...>
    .option('-c, --appConfigID <value>', 'Select specific appConfigID') // <ios|android|web|...>
    .option('-t, --target <value>', 'Select specific simulator') // <.....>
    .option('-d, --device', 'Select connected device')
    .option('-s, --scheme <value>', 'Select build scheme') // <Debug | Release>
    .option('-e, --env', 'Select environment') // <alpha|beta|prod>
    .option('-l, --list', 'Return list of items related to command') // <alpha|beta|prod>
    .option('-r, --reset', 'Also perform reset')
    .option('-b, --blueprint', 'Blueprint for targets')
    .option('-h, --host <value>', 'Custom Host IP')
    .option('-P, --port <value>', 'Custom Port')
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

cli.default.run(cmdValue, cmdOption, program, process);
