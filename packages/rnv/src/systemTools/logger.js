import _chalk from 'chalk';
import { generateOptions } from './prompt';
import Analytics from './analytics';

const _chalkCols = {
    white: v => v,
    green: v => v,
    red: v => v,
    yellow: v => v,
    default: v => v,
    gray: v => v,
    grey: v => v,
    blue: v => v,
    magenta: v => v,
};
const _chalkMono = {
    ..._chalkCols,
    bold: _chalkCols
};

let chalk = _chalk;


const RNV_START = '🚀 ReNative';
let RNV = 'ReNative';
const LINE = chalk.bold.white('----------------------------------------------------------');
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

    if (_c?.files?.rnv?.package?.version) {
        _c.rnvVersion = _c.files.rnv.package.version;
        str += printIntoBox(`      Version: ${chalk.green(_c.rnvVersion)}`, 1);
        if (_c.rnvVersion.includes('alpha')) {
            str += printIntoBox(`      ${chalk.yellow('WARNING: this is a prerelease version.')}`, 1);
            str += printIntoBox(`      ${chalk.yellow('Use "npm install rnv" for stable one.')}`, 1);
        }
    }
    str += printIntoBox(`      ${chalk.grey('https://renative.org')}`, 1);
    str += printIntoBox(`      🚀 ${chalk.yellow('Firing up!...')}`, 1);
    str += printIntoBox(`      ${getCurrentCommand()}`);
    if (_c?.timeStart) str += printIntoBox(`      Start Time: ${_c.timeStart.toLocaleString()}`);
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    console.log(str);
};

let _messages = [];
let _currentCommand;
let _currentProcess;
let _isInfoEnabled = false;
let _c;
let _isMono = false;
let _defaultColor;
let _highlightColor;


export const configureLogger = (c, process, command, subCommand, isInfoEnabled) => {
    _messages = [];
    _c = c;
    _c.timeStart = new Date();
    _currentProcess = process;
    _currentCommand = command;
    _currentSubCommand = subCommand;
    _isInfoEnabled = isInfoEnabled;
    _isMono = c.program.mono;
    if (_isMono) {
        chalk = _chalkMono;
    }
    _updateDefaultColors();
    RNV = getCurrentCommand();
};

const _updateDefaultColors = () => {
    _defaultColor = chalk.gray;
    _highlightColor = chalk.green;
};
_updateDefaultColors();

export const logAndSave = (msg, skipLog) => {
    if (_messages && !_messages.includes(msg)) _messages.push(msg);
    if (!skipLog) console.log(`${msg}`);
};

const PRIVATE_PARAMS = ['-k', '--key'];

export const getCurrentCommand = (excludeDollar = false) => {
    if (!_c) return '_c is undefined';
    const argArr = _c.process.argv.slice(2);
    let hideNext = false;
    const output = argArr.map((v) => {
        if (hideNext) {
            hideNext = false;
            return '********';
        }
        if (PRIVATE_PARAMS.includes(v)) {
            hideNext = true;
        }

        return v;
    }).join(' ');
    const dollar = excludeDollar ? '' : '$ ';
    return `${dollar}rnv ${output}`;
};

export const logToSummary = (v) => {
    _messages.push(`\n${v}`);
};

export const logSummary = () => {
    let logContent = printIntoBox('All good as 🦄 ');
    if (_messages && _messages.length) {
        logContent = '';
        _messages.forEach((m) => {
            logContent += `│ ${m}\n`;
        });
    }


    let timeString = '';
    if (_c) {
        _c.timeEnd = new Date();
        timeString = `| ${_c.timeEnd.toLocaleString()}`;
    }

    let str = printBoxStart(`🚀  SUMMARY ${timeString}`, getCurrentCommand());
    if (_c) {
        if (_c.files.project.package) {
            str += printIntoBox(`Project Name: ${_highlightColor(_c.files.project.package.name)}`, 1);
            str += printIntoBox(`Project Version: ${_highlightColor(_c.files.project.package.version)}`, 1);
        }
        if (_c.buildConfig?._meta?.currentAppConfigId) {
            str += printIntoBox(`App Config: ${_highlightColor(_c.buildConfig._meta?.currentAppConfigId)}`, 1);
        }
        if (_c.buildConfig?.workspaceID) {
            str += printIntoBox(`Workspace: ${_highlightColor(_c.buildConfig.workspaceID)}`, 1);
        }
        if (_c.files.project.config) {
            const defaultProjectConfigs = _c.files.project.config.defaults;
            if (defaultProjectConfigs?.supportedPlatforms) {
                const plats = [];
                generateOptions(_c.buildConfig?.defaults?.supportedPlatforms, true, null, (i, obj, mapping, defaultVal) => {
                    let isEjected = '';
                    if (_c.paths.project.platformTemplatesDirs) {
                        isEjected = _c.paths.project.platformTemplatesDirs[obj].includes(_c.paths.rnv.platformTemplates.dir) ? '' : '(ejected)';
                    }

                    plats.push(`${defaultVal}${isEjected}`);
                });
                str += printArrIntoBox(plats, 'Supported Platforms: ');
            }
            if (defaultProjectConfigs?.template) {
                str += printIntoBox(`Master Template: ${_highlightColor(defaultProjectConfigs.template)}`, 1);
            }
        }
        if (_c.process) {
            const envString = `${_c.process.platform} | ${_c.process.arch} | node v${_c.process.versions?.node} | rnv v${_c.rnvVersion}`;
            str += printIntoBox(`Env Info: ${chalk.gray(envString)}`, 1);
        }

        if (_c.program.scheme) str += printIntoBox(`Build Scheme: ${_highlightColor(_c.program.scheme)}`, 1);
        if (_c.platform) str += printIntoBox(`Platform: ${_highlightColor(_c.platform)}`, 1);
        if (_c.timeEnd) {
            str += printIntoBox(`Executed Time: ${chalk.yellow(_msToTime(_c.timeEnd - _c.timeStart))}`, 1);
        }
    }

    str += printIntoBox('');
    str += logContent;
    str += printIntoBox('');
    str += printBoxEnd();

    console.log(str);
};

const _msToTime = (s) => {
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return `${hrs}h:${mins}m:${secs}s:${ms}ms`;
};

export const setCurrentJob = (job) => {
    _currentCommand = job;
};

export const logTask = (task, customChalk) => {
    const ch = customChalk || chalk.green;
    const postMsg = customChalk ? '' : ' - Starting!';
    console.log(ch(`${RNV} - ${task}${postMsg}`));
};

export const logWarning = (msg) => {
    logAndSave(chalk.yellow(`⚠️  ${RNV} - WARNING: ${msg}`));
};

export const logInfo = (msg) => {
    console.log(chalk.magenta(`ℹ️  ${RNV} - NOTE: ${msg}`));
};

export const logDebug = (...args) => {
    if (_isInfoEnabled) console.log.apply(null, args);
};

export const isInfoEnabled = () => _isInfoEnabled;

export const logComplete = (isEnd = false) => {
    console.log(chalk.bold.white(`\n ${RNV} - Done! 🚀`));
    if (isEnd) logEnd(0);
};

export const logSuccess = (msg) => {
    logAndSave(`✅ ${chalk.magenta(msg)}`);
};

export const logError = (e, isEnd = false, skipAnalytics = false) => {
    if (!skipAnalytics) {
        Analytics.captureException(e);
    }

    if (e && e.message) {
        logAndSave(chalk.bold.red(`🛑  ${RNV} - ERRROR! ${e.message}\n${e.stack}`), isEnd);
    } else {
        logAndSave(chalk.bold.red(`🛑  ${RNV} - ERRROR! ${e}`), isEnd);
    }

    if (isEnd) logEnd(1);
};

export const logEnd = (code) => {
    logSummary();
    if (_currentProcess) {
        Analytics.teardown().then(() => {
            _currentProcess.exit(code);
        });
    }
};


export const logInitialize = () => {
    logWelcome();
    // console.log(
    //     chalk.white(`\n${LINE}\n ${RNV_START} ${chalk.white.bold(`${_currentCommand} ${_currentSubCommand || ''}`)} is firing up! 🔥\n${LINE}\n`),
    // );
};

export const logAppInfo = c => new Promise((resolve, reject) => {
    console.log(chalk.gray(`\n${LINE2}\nℹ️  Current App Config: ${chalk.bold.white(c.buildConfig.id)}\n${LINE2}`));

    resolve();
});

export const printIntoBox = (str2, chalkIntend = 0) => {
    let output = _defaultColor('│  ');
    let endLine = '';
    let intend;
    if (_isMono) {
        intend = 0;
        chalkIntend = 0;
    } else {
        intend = str2 === '' ? 1 : 2;
    }
    for (let i = 0; i < chalkIntend + intend; i++) {
        endLine += '          ';
    }
    endLine += '                                                                               │\n';
    output += _defaultColor(str2);
    const l = output.length - endLine.length;
    output += _defaultColor(endLine.slice(l));
    return output;
};

export const printArrIntoBox = (arr, prefix = '') => {
    let output = '';
    let stringArr = '';
    let i = 0;
    arr.forEach((v) => {
        const l = i === 0 ? 60 - _defaultColor(prefix).length : 60;
        if (stringArr.length > l) {
            if (i === 0 && prefix.length) {
                output += printIntoBox(`${_defaultColor(prefix)}${_defaultColor(stringArr)}`, 2);
            } else {
                output += printIntoBox(_defaultColor(stringArr), 1);
            }

            stringArr = '';
            i++;
        }
        stringArr += `${v}, `;
        // stringArr[i] += `${c.platformDefaults[v].icon} ${chalk.white(v)}, `;
    });
    if (i === 0 && prefix.length) {
        output += printIntoBox(`${_defaultColor(prefix)}${_defaultColor(stringArr.slice(0, -2))}`, 2);
    } else {
        output += printIntoBox(_defaultColor(stringArr.slice(0, -2)), 1);
    }

    return output;
};

export const printBoxStart = (str, str2) => {
    let output = _defaultColor('┌──────────────────────────────────────────────────────────────────────────────┐\n');
    output += printIntoBox(str);
    output += printIntoBox(str2 || '');
    output += _defaultColor('├──────────────────────────────────────────────────────────────────────────────┤\n');
    return output;
};

export const rnvStatus = async () => Promise.resolve();

export const printBoxEnd = () => _defaultColor('└──────────────────────────────────────────────────────────────────────────────┘');

export default {
    logEnd,
    logInfo,
    logTask,
    logError,
    logDebug,
    logAppInfo,
    logWarning,
    logSuccess,
    logWelcome,
    logComplete,
    logInitialize
};
