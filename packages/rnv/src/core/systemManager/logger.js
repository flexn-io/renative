/* eslint-disable no-console */
import _chalk from 'chalk';
import { isSystemWin } from './utils';

function ansiRegex({ onlyFirst = false } = {}) {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
    ].join('|');

    return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

export function stripAnsi(string) {
    if (typeof string !== 'string') {
        throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
    }

    return string.replace(ansiRegex(), '');
}

const ICN_ROCKET = isSystemWin ? 'RNV' : '🚀';
const ICN_UNICORN = isSystemWin ? 'unicorn' : '🦄';

const _chalkCols = {
    white: (v) => v,
    green: (v) => v,
    red: (v) => v,
    yellow: (v) => v,
    default: (v) => v,
    gray: (v) => v,
    grey: (v) => v,
    blue: (v) => v,
    cyan: (v) => v,
    magenta: (v) => v,
};
_chalkCols.rgb = () => (v) => v;
_chalkCols.bold = _chalkCols;
const _chalkMono = {
    ..._chalkCols,
};

let currentChalk = _chalk;

let RNV = 'ReNative';

export const chalk = () => currentChalk || _chalk;

export const logWelcome = () => {
    // prettier-ignore
    let str = _defaultColor(`
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│        ${currentChalk.red('██████╗')} ███████╗${currentChalk.red('███╗   ██╗')} █████╗ ████████╗██╗${currentChalk.red('██╗   ██╗')}███████╗       │
│        ${currentChalk.red('██╔══██╗')}██╔════╝${currentChalk.red('████╗  ██║')}██╔══██╗╚══██╔══╝██║${currentChalk.red('██║   ██║')}██╔════╝       │
│        ${currentChalk.red('██████╔╝')}█████╗  ${currentChalk.red('██╔██╗ ██║')}███████║   ██║   ██║${currentChalk.red('██║   ██║')}█████╗         │
│        ${currentChalk.red('██╔══██╗')}██╔══╝  ${currentChalk.red('██║╚██╗██║')}██╔══██║   ██║   ██║${currentChalk.red('╚██╗ ██╔╝')}██╔══╝         │
│        ${currentChalk.red('██║  ██║')}███████╗${currentChalk.red('██║ ╚████║')}██║  ██║   ██║   ██║${currentChalk.red(' ╚████╔╝ ')}███████╗       │
│        ${currentChalk.red('╚═╝  ╚═╝')}╚══════╝${currentChalk.red('╚═╝  ╚═══╝')}╚═╝  ╚═╝   ╚═╝   ╚═╝${currentChalk.red('  ╚═══╝  ')}╚══════╝       │
│                                                                              │
`);

    if (cnf().files?.rnv?.package?.version) {
        cnf().rnvVersion = cnf().files.rnv.package.version;
        str += printIntoBox(`      Version: ${currentChalk.green(cnf().rnvVersion)}`, 1);
        if (cnf().rnvVersion?.includes?.('alpha')) {
            str += printIntoBox(`      ${currentChalk.yellow('WARNING: this is a prerelease version.')}`, 1);
        }
    }
    str += printIntoBox(`      ${currentChalk.grey('https://renative.org')}`, 1);
    str += printIntoBox(`      ${ICN_ROCKET} ${currentChalk.yellow('Firing up!...')}`, 1);
    str += printIntoBox(`      $ ${currentChalk.cyan(getCurrentCommand(true))}`, 1);
    if (global.timeStart) {
        str += printIntoBox(`      Start Time: ${currentChalk.grey(global.timeStart.toLocaleString())}`);
    }
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    console.log(str);
};

let _currentProcess;
let _isInfoEnabled = false;
let _infoFilter = [];
let _c;
let _isMono = false;
let _defaultColor;
let _highlightColor;
let _analytics;
let _jsonOnly;

const cnf = () => {
    if (!_c) {
        _configureLogger(global.RNV_CONFIG, global.RNV_ANALYTICS);
    }
    return _c;
};

const _configureLogger = (c, analytics) => {
    global._messages = [];
    _c = c;
    if (!global.timeStart) global.timeStart = new Date();
    _currentProcess = c.process;
    _isInfoEnabled = !!c.program.info;
    _jsonOnly = !!c.program.json;
    _infoFilter = c.program.info?.split?.(',');
    _isMono = c.program.mono;
    _analytics = analytics;
    if (_isMono) {
        currentChalk = _chalkMono;
    }
    _updateDefaultColors();
    RNV = getCurrentCommand();
};

const _updateDefaultColors = () => {
    _defaultColor = currentChalk.gray;
    _highlightColor = currentChalk.green;
};
_updateDefaultColors();

export const logAndSave = (msg, skipLog) => {
    if (global._messages && !global._messages.includes(msg)) global._messages.push(msg);
    if (!skipLog) console.log(`${msg}`);
};

const PRIVATE_PARAMS = ['-k', '--key'];

const _printJson = (obj) => {
    // sanitize
    if (obj.task) {
        obj.task = obj.task.trim().replace('[', '').replace(']', '');
    }
    console.log(JSON.stringify(obj));
};

export const getCurrentCommand = (excludeDollar = false) => {
    const argArr = cnf().process.argv.slice(2);
    let hideNext = false;
    const output = argArr
        .map((v) => {
            if (hideNext) {
                hideNext = false;
                return '********';
            }
            if (PRIVATE_PARAMS.includes(v)) {
                hideNext = true;
            }

            return v;
        })
        .join(' ');
    const dollar = excludeDollar ? '' : '$ ';
    return `${dollar}rnv ${output}`;
};

export const logToSummary = (v, sanitizePaths) => {
    const _v = sanitizePaths ? _sanitizePaths(v) : v;
    global._messages.push(`\n${_v}`);
};

export const logRaw = (...args) => {
    if (_jsonOnly) {
        return _printJson({
            type: 'rawLog',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(JSON.stringify(args))),
        });
    }
    console.log.apply(null, args);
};

export const logSummary = (header = 'SUMMARY') => {
    let logContent = printIntoBox(`All good as ${ICN_UNICORN} `);
    if (global._messages && global._messages.length) {
        logContent = '';
        global._messages.forEach((m) => {
            logContent += `│ ${m}\n`;
        });
    }

    let timeString = '';
    global.timeEnd = new Date();
    timeString = `| ${global.timeEnd.toLocaleString()}`;

    let str = printBoxStart(`${ICN_ROCKET}  ${header} ${timeString}`, getCurrentCommand());

    str += printIntoBox(`ReNative Version: ${_highlightColor(cnf().rnvVersion)}`, 1);
    if (cnf().files?.project?.package) {
        str += printIntoBox(`Project Name ($package.name): ${_highlightColor(cnf().files.project.package.name)}`, 1);
        str += printIntoBox(
            `Project Version ($package.version): ${_highlightColor(cnf().files.project.package.version)}`,
            1
        );
    }

    if (cnf().buildConfig?.workspaceID) {
        str += printIntoBox(`Workspace ($.workspaceID): ${_highlightColor(cnf().buildConfig.workspaceID)}`, 1);
    }
    if (cnf().platform) {
        str += printIntoBox(`Platform (-p): ${_highlightColor(cnf().platform)}`, 1);
    }
    if (cnf().runtime?.engine) {
        let addon = '';
        if (cnf().platform) {
            addon = ` ($.platforms.${cnf().platform}.engine)`;
        }
        str += printIntoBox(`Engine${addon}: ${_highlightColor(cnf().runtime?.engine?.config?.id)}`, 1);
    }
    if (cnf().runtime?.activeTemplate) {
        str += printIntoBox(`Template: ${_highlightColor(cnf().runtime?.activeTemplate)}`, 1);
    }
    if (cnf().buildConfig?._meta?.currentAppConfigId) {
        str += printIntoBox(`App Config (-c): ${_highlightColor(cnf().buildConfig._meta?.currentAppConfigId)}`, 1);
    }
    if (cnf().runtime?.scheme) {
        str += printIntoBox(`Build Scheme (-s): ${_highlightColor(cnf().runtime?.scheme)}`, 1);
    }
    if (cnf().runtime?.bundleAssets) {
        str += printIntoBox(
            `Bundle assets ($.platforms.${cnf().platform}.bundleAssets): ${_highlightColor(
                !!cnf().runtime?.bundleAssets
            )}`,
            1
        );
    }
    if (cnf().runtime?.target) {
        str += printIntoBox(`Target (-t): ${_highlightColor(cnf().runtime?.target)}`, 1);
    }
    if (cnf().program?.reset) {
        str += printIntoBox(`Reset Project (-r): ${_highlightColor(!!cnf().program?.reset)}`, 1);
    }
    if (cnf().program?.resetHard) {
        str += printIntoBox(`Reset Project and Assets (-R): ${_highlightColor(!!cnf().program?.resetHard)}`, 1);
    }
    if (cnf().runtime?.supportedPlatforms?.length) {
        const plats = cnf().runtime.supportedPlatforms.map((v) => `${v.platform}${v.isConnected ? '' : '(ejected)'}`);
        str += printArrIntoBox(plats, 'Supported Platforms: ');
    }

    if (cnf().files?.project?.config?.defaults) {
        const defaultProjectConfigs = cnf().files.project.config.defaults;
        if (defaultProjectConfigs?.template) {
            str += printIntoBox(`Master Template: ${_highlightColor(defaultProjectConfigs.template)}`, 1);
        }
    }

    if (cnf().process) {
        const envString = `${cnf().process.platform} | ${cnf().process.arch} | node v${cnf().process.versions?.node}`;
        str += printIntoBox(`Env Info: ${currentChalk.gray(envString)}`, 1);
    }

    if (global.timeEnd) {
        str += printIntoBox(`Executed Time: ${currentChalk.yellow(_msToTime(global.timeEnd - global.timeStart))}`, 1);
    }

    str += printIntoBox('');
    str += logContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    str += printIntoBox('');
    if (cnf().runtime?.platformBuildsProjectPath) {
        str += printIntoBox('Project location:');
        str += printIntoBox(`${currentChalk.cyan(_sanitizePaths(cnf().runtime.platformBuildsProjectPath))}`, 1);
    }
    str += printBoxEnd();

    console.log(str);
};

const _msToTime = (seconds) => {
    let s = seconds;
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return `${hrs}h:${mins}m:${secs}s:${ms}ms`;
};

const _getCurrentTask = () => (cnf()._currentTask ? currentChalk.grey(` [${cnf()._currentTask}]`) : '');

const _sanitizePaths = (msg) => {
    // let dir
    // const config = cnf().files?.project?.config;
    // if(config && config.isMonorepo) {
    //     if()
    // }
    if (msg?.replace && cnf().paths?.project?.dir) {
        return msg.replace(new RegExp(cnf().paths.project.dir, 'g'), '.');
    }
    return msg;
};

const TASK_COUNTER = {};

export const logTask = (task, customChalk) => {
    if (!TASK_COUNTER[task]) TASK_COUNTER[task] = 0;
    TASK_COUNTER[task] += 1;
    const taskCount = currentChalk.grey(`[${TASK_COUNTER[task]}]`);

    if (_jsonOnly) {
        return _printJson({
            type: 'task',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(typeof customChalk === 'string' ? customChalk : task)),
        });
    }

    let msg = '';
    if (typeof customChalk === 'string') {
        msg = `${currentChalk.green(`[ task ]${_getCurrentTask()} ${task}`)}${taskCount} ${currentChalk.grey(
            customChalk
        )}`;
    } else if (customChalk) {
        msg = customChalk(`[ task ]${_getCurrentTask()} ${task}${taskCount}`);
    } else {
        msg = currentChalk.green(`[ task ]${_getCurrentTask()} ${task}${taskCount}`);
    }

    console.log(_sanitizePaths(msg));
};

export const logInitTask = (task, customChalk) => {
    if (_jsonOnly) {
        return _printJson({
            type: 'taskInit',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(typeof customChalk === 'string' ? customChalk : task)),
        });
    }
    let msg = '';
    if (typeof customChalk === 'string') {
        msg = `${currentChalk.rgb(183, 84, 117)(`[ task ] ${task}`)} ${currentChalk.grey(customChalk)}`;
    } else if (customChalk) {
        msg = customChalk(`[ task ] ${task}`);
    } else {
        msg = currentChalk.rgb(183, 84, 117)(`[ task ] ${task}`);
    }

    console.log(msg);
};

export const logExitTask = (task, customChalk) => {
    if (_jsonOnly) {
        return _printJson({
            type: 'taskExit',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(typeof customChalk === 'string' ? customChalk : task)),
        });
    }
    let msg = '';
    if (typeof customChalk === 'string') {
        msg = `${currentChalk.rgb(183, 84, 117)(`[ task ] ${task}`)} ${currentChalk.grey(customChalk)}`;
    } else if (customChalk) {
        msg = customChalk(`[ task ] ${task}`);
    } else {
        msg = currentChalk.rgb(183, 84, 117)(`[ task ] ${task}`);
    }

    console.log(msg);
};

export const logHook = (hook = '', msg = '') => {
    if (_jsonOnly) {
        const payload = { type: 'hook', hook, message: stripAnsi(_sanitizePaths(msg)) };
        if (_getCurrentTask()) payload.task = stripAnsi(_getCurrentTask());
        return _printJson(payload);
    }
    console.log(
        `${currentChalk.rgb(127, 255, 212)(`[ hook ]${_getCurrentTask()} ${hook}`)} ${currentChalk.grey(
            _sanitizePaths(msg)
        )}`
    );
};

export const logWarning = (msg) => {
    if (_jsonOnly) {
        return _printJson({
            type: 'log',
            level: 'warning',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(msg)),
        });
    }
    logAndSave(currentChalk.yellow(`[ warn ]${_getCurrentTask()} ${_sanitizePaths(msg)}`));
};

export const logInfo = (msg) => {
    if (_jsonOnly) {
        return _printJson({
            type: 'log',
            level: 'info',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(msg)),
        });
    }
    console.log(currentChalk.cyan(`[ info ]${_getCurrentTask()} ${_sanitizePaths(msg)}`));
};

export const logDebug = (...args) => {
    if (_isInfoEnabled) {
        if (_jsonOnly) {
            return _printJson({
                type: 'log',
                level: 'debug',
                task: stripAnsi(_getCurrentTask()),
                message: stripAnsi(_sanitizePaths(...args)),
            });
        }
        if (_infoFilter) {
            const firstArg = args[0];

            if (_infoFilter.filter((v) => firstArg?.includes?.(v)).length) {
                console.log.apply(null, args);
            }
        } else {
            console.log.apply(null, args);
        }
    }
};

export const isInfoEnabled = () => _isInfoEnabled;

export const logComplete = (isEnd = false) => {
    if (_jsonOnly) return;
    console.log(currentChalk.bold.white(`\n ${RNV} - Done! ${ICN_ROCKET}`));
    if (isEnd) logEnd(0);
};

export const logSuccess = (msg) => {
    if (_jsonOnly) {
        return _printJson({
            type: 'success',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(msg)),
        });
    }
    logAndSave(currentChalk.magenta(`[ success ]${_getCurrentTask()} ${_sanitizePaths(msg)}`));
};

export const logError = (e, isEnd = false, skipAnalytics = false) => {
    if (!skipAnalytics && !!_analytics) {
        const extra = {
            command: getCurrentCommand(),
            version: cnf().rnvVersion,
            engine: cnf().runtime?.engine?.config?.id,
            platform: cnf().platform,
            bundleAssets: !!cnf().runtime?.bundleAssets,
            os: cnf().process?.platform,
            arch: cnf().process?.arch,
            node: cnf().process?.versions?.node,
        };
        _analytics.captureException(e, { extra });
    }

    if (_jsonOnly) {
        _printJson({
            type: 'log',
            level: 'error',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(e?.message || e)),
        });
    } else if (e && e.message) {
        logAndSave(currentChalk.red(`[ error ]${_getCurrentTask()} ${e.message}\n${e.stack}`), isEnd);
    } else {
        logAndSave(currentChalk.red(`[ error ]${_getCurrentTask()} ${e}`), isEnd);
    }

    cnf().runtime.keepSessionActive = false;
    if (isEnd) logEnd(1);
};

export const logEnd = (code) => {
    if (!_jsonOnly) {
        logSummary();
    }

    if (_currentProcess && !!_analytics) {
        _analytics.teardown().then(() => {
            _currentProcess.exit(code);
        });
    }
};

export const logInitialize = () => {
    cnf();
    if (!_jsonOnly) logWelcome();
};

export const logAppInfo = (c) => {
    if (!_jsonOnly) {
        logInfo(`Current App Config: ${currentChalk.bold.white(c.runtime.appId)}`);
    }
};

export const printIntoBox = (str) => {
    let output = _defaultColor('│  ');

    const strLenDiff = str.length - stripAnsi(str).length;
    output += _defaultColor(str);
    const maxLen = 76;
    const len = maxLen - (str.length - strLenDiff);
    if (len > 0) {
        for (let i = 0; i < len; i++) {
            output += ' ';
        }
        output += _defaultColor('│\n');
    } else {
        output += _defaultColor('\n');
    }

    return output;
};

export const printArrIntoBox = (arr, prefix = '') => {
    if (_jsonOnly) return arr;

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
        // stringArr[i] += `${c.platformDefaults[v].icon} ${currentChalk.white(v)}, `;
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

export const printBoxEnd = () =>
    _defaultColor('└──────────────────────────────────────────────────────────────────────────────┘');

export default {
    chalk,
    logHook,
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
    logInitialize,
};
