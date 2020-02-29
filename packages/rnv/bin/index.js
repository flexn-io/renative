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
    .option('-u, --updatePods', 'force Update dependencies (iOS only)')
    .option('-p, --platform [value]', 'select specific Platform')
    .option('-c, --appConfigID [value]', 'select specific app Config id')
    .option('-t, --target [value]', 'select specific Target device/simulator')
    .option('-T, --template <value>', 'select specific template')
    .option('-d, --device [value]', 'select connected Device')
    .option('-s, --scheme [value]', 'select build Scheme')
    .option('-f, --filter <value>', 'Filter value')
    .option('-l, --list', 'return List of items related to command')
    .option('-o, --only', 'run Only top command (Skip dependencies)')
    .option('-r, --reset', 'also perform Reset of platform')
    .option('-R, --resetHard', 'also perform Reset of platform and all assets')
    .option('-k, --key <value>', 'Pass the key/password')
    .option('-b, --blueprint', 'Blueprint for targets')
    .option('-H, --host <value>', 'custom Host ip')
    .option('-x, --exeMethod <value>', 'eXecutable method in buildHooks')
    .option('-P, --port <value>', 'custom Port')
    .option('-D, --debug', 'enable remote debugger')
    .option('-G, --global', 'Flag for setting a config value for all RNV projects')
    .option('--debugIp <value>', '(optional) overwrite the ip to which the remote debugger will connect')
    .option('--ci', 'CI/CD flag so it wont ask questions')
    .option('--mono', 'Monochrome console output without chalk')
    .option('--skipNotifications', 'Skip sending any integrated notifications')
    .option('--keychain <value>', 'Name of the keychain')
    .option('--provisioningStyle <value>', 'Set provisioningStyle <Automatic | Manual>')
    .option('--codeSignIdentity <value>', 'Set codeSignIdentity ie <iPhone Distribution>')
    .option('--provisionProfileSpecifier <value>', 'Name of provisionProfile')
    .option('--hosted', 'Run in a hosted environment (skip budleAssets)')
    .option('--maxErrorLength <number>', 'Specify how many characters each error should display. Default 200')
    .option('--skipTargetCheck', 'Skip Android target check, just display the raw adb devices to choose from')
    .option('--analyzer', 'Enable real-time bundle analyzer')
    .option('--xcodebuildArchiveArgs <value>', 'pass down custom xcodebuild arguments')
    .option('--xcodebuildExportArgs <value>', 'pass down custom xcodebuild arguments')
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
