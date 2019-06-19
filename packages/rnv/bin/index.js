#!/usr/bin/env node
const program = require('commander');
const fs = require('fs');
const path = require('path');

global.fetch = require('node-fetch');

global.Headers = global.fetch.Headers;

const cli = require('../dist/index.js');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')));
let cmdValue;
let cmdOption;

program
    .version(packageJson.version)
    .option('-i, --info', 'show full debug Info')
    .option('-u, --update', 'force Update dependencies (iOS only)')
    .option('-p, --platform <value>', 'select specific Platform')
    .option('-c, --appConfigID <value>', 'select specific app Config id')
    .option('-t, --target <value>', 'select specific Target device/simulator')
    .option('-d, --device [value]', 'select connected Device')
    .option('-s, --scheme <value>', 'select build Scheme')
    .option('-f, --filter <value>', 'Filter value')
    .option('-l, --list', 'return List of items related to command')
    .option('-o, --only', 'run Only top command (Skip dependencies)')
    .option('-r, --reset', 'also perform Reset')
    .option('-b, --blueprint', 'Blueprint for targets')
    .option('-H, --host <value>', 'custom Host ip')
    .option('-x, --exeMethod <value>', 'eXecutable method in buildHooks')
    .option('-P, --port <value>', 'custom Port')
    .option('-D, --debug', 'enable remote debugger')
    .option('--debugIp <value>', '(optional) overwrite the ip to which the remote debugger will connect')
    .option('--ci', 'CI/CD flag so it wont ask questions')
    .arguments('<cmd> [option]')
    .action((cmd, option) => {
        cmdValue = cmd;
        cmdOption = option;
    });

program.parse(process.argv);

// if (typeof cmdValue === 'undefined') {
//     console.error('no command given!');
//     process.exit(1);
// }
// console.log('command:', cmdValue, cmdOption, program);

cli.default.run(cmdValue, cmdOption, program, process);
