#!/usr/bin/env node
const program = require('commander');

global.fetch = require('node-fetch');

global.Headers = global.fetch.Headers;

const cli = require('../dist/index.js');

program
    .arguments('<command>')
    .action((command) => {
        cli.default.run(program, command, process.argv);
    }).parse(process.argv);
