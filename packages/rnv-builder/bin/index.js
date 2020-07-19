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
    .arguments('<cmd> [option]')
    .action((cmd, option) => {
        cmdValue = cmd;
        cmdOption = option;
    });

program.parse(process.argv);

cli.default.run(cmdValue, cmdOption, program, process);
