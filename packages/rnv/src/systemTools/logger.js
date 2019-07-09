import chalk from 'chalk';


const RNV_START = '🚀 ReNative';
const RNV = 'ReNative';
const LINE = chalk.white.bold('----------------------------------------------------------');
const LINE2 = chalk.gray('----------------------------------------------------------');

export const logWelcome = () => {
    let str = _defaultColor(`
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│        ${chalk.red('██████╗')} ███████╗${chalk.red('███╗   ██╗')} █████╗ ████████╗██╗${chalk.red('██╗   ██╗')}███████╗       │
│        ${chalk.red('██╔══██╗')}██╔════╝${chalk.red('████╗  ██║')}██╔══██╗╚══██╔══╝██║${chalk.red('██║   ██║')}██╔════╝       │
│        ${chalk.red('██████╔╝')}█████╗  ${chalk.red('██╔██╗ ██║')}███████║   ██║   ██║${chalk.red('██║   ██║')}█████╗         │
│        ${chalk.red('██╔══██╗')}██╔══╝  ${chalk.red('██║╚██╗██║')}██╔══██║   ██║   ██║${chalk.red('╚██╗ ██╔╝')}██╔══╝         │
│        ${chalk.red('██║  ██║')}███████╗${chalk.red('██║ ╚████║')}██║  ██║   ██║   ██║${chalk.red(' ╚████╔╝ ')}███████╗       │
│        ${chalk.red('╚═╝  ╚═╝')}╚══════╝${chalk.red('╚═╝  ╚═══╝')}╚═╝  ╚═╝   ╚═╝   ╚═╝${chalk.red('  ╚═══╝  ')}╚══════╝       │
│                                                                              │
`);

    if (_c?.files?.rnvPackage?.version) str += printIntoBox(`      Version: ${chalk.green(_c.files.rnvPackage.version)}`, 1);
    str += printIntoBox(`      ${chalk.blue('https://renative.org')}`, 1);
    str += printIntoBox(`      🚀 ${chalk.yellow('Firing up!...')}`, 1);
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    console.log(str);
};

let _messages;
let _currentJob;
let _currentProcess;
let _isInfoEnabled = false;
let _c;

export const configureLogger = (c, process, job, subCommand, isInfoEnabled) => {
    _messages = [];
    _c = c;
    _currentJob = job;
    _currentProcess = process;
    _currentSubCommand = subCommand;
    _isInfoEnabled = isInfoEnabled;
};

export const logAndSave = (msg, skipLog) => {
    if (_messages && _messages.includes(msg)) _messages.push(msg);
    if (!skipLog) console.log(`${msg}`);
};

export const logSummary = () => {
    let logContent = printIntoBox('All good as 🦄 ');
    if (_messages && _messages.length) {
        logContent = '';
        _messages.forEach((m) => {
            logContent += `│ ${m}\n`;
        });
    }


    let str = printBoxStart('🚀  SUMMARY');
    // str += printIntoBox('SHlelelele euheu ehhh');
    if (_c) {
        if (_c.appId) str += printIntoBox(`App Config: ${_highlightColor(_c.appId)}`, 1);
        if (_c.program.scheme) str += printIntoBox(`Build Scheme: ${_highlightColor(_c.program.scheme)}`, 1);
        if (_c.platform) str += printIntoBox(`Platform: ${_highlightColor(_c.platform)}`, 1);
    }

    str += printIntoBox('');
    str += logContent;
    str += printIntoBox('');
    str += printBoxEnd();

    console.log(str);
};

export const setCurrentJob = (job) => {
    _currentJob = job;
};

export const logTask = (task) => {
    console.log(chalk.green(`${RNV} ${_currentJob} - ${task} - Starting!`));
};

export const logWarning = (msg) => {
    logAndSave(chalk.yellow(`⚠️  ${RNV} ${_currentJob} - WARNING: ${msg}`));
};

export const logInfo = (msg) => {
    console.log(chalk.magenta(`ℹ️  ${RNV} ${_currentJob} - NOTE: ${msg}`));
};

export const logDebug = (...args) => {
    if (_isInfoEnabled) console.log.apply(null, args);
};

export const logComplete = (isEnd = false) => {
    console.log(chalk.white.bold(`\n ${RNV} ${_currentJob || ''} - Done! 🚀`));
    if (isEnd) logEnd(0);
};

export const logSuccess = (msg) => {
    console.log(`✅ ${chalk.magenta(msg)}`);
};

export const logError = (e, isEnd = false) => {
    if (e && e.message) {
        logAndSave(chalk.red.bold(`🛑  ${RNV} ${_currentJob} - ERRROR! ${e.message}\n${e.stack}`), isEnd);
    } else {
        logAndSave(chalk.red.bold(`🛑  ${RNV} ${_currentJob} - ERRROR! ${e}`), isEnd);
    }
    if (isEnd) logEnd(1);
};

export const logEnd = (code) => {
    logSummary();
    if (_currentProcess) _currentProcess.exit(code);
};

export const logInitialize = () => {
    logWelcome();
    // console.log(
    //     chalk.white(`\n${LINE}\n ${RNV_START} ${chalk.white.bold(`${_currentJob} ${_currentSubCommand || ''}`)} is firing up! 🔥\n${LINE}\n`),
    // );
};

export const logAppInfo = c => new Promise((resolve, reject) => {
    console.log(chalk.gray(`\n${LINE2}\nℹ️  Current App Config: ${chalk.white.bold(c.files.appConfigFile.id)}\n${LINE2}`));

    resolve();
});

const _defaultColor = chalk.gray;
const _highlightColor = chalk.green;

export const printIntoBox = (str2, chalkIntend = 0) => {
    let output = _defaultColor('│  ');
    let endLine = '';
    const intend = str2 === '' ? 1 : 2;
    for (let i = 0; i < chalkIntend + intend; i++) {
        endLine += '          ';
    }
    endLine += '                                                                               │\n';
    output += _defaultColor(str2);
    const l = output.length - endLine.length;
    output += _defaultColor(endLine.slice(l));
    return output;
};

export const printBoxStart = (str) => {
    let output = _defaultColor('┌──────────────────────────────────────────────────────────────────────────────┐\n');
    output += printIntoBox(str);
    output += _defaultColor('├──────────────────────────────────────────────────────────────────────────────┤\n');
    return output;
};

export const printBoxEnd = () => _defaultColor('└──────────────────────────────────────────────────────────────────────────────┘');
