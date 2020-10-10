/* eslint-disable no-console */
import _chalk from 'chalk';

const _chalkCols = {
    white: v => v,
    green: v => v,
    red: v => v,
    yellow: v => v,
    default: v => v,
    gray: v => v,
    grey: v => v,
    blue: v => v,
    cyan: v => v,
    magenta: v => v
};
_chalkCols.rgb = () => v => v;
_chalkCols.bold = _chalkCols;
const _chalkMono = {
    ..._chalkCols
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

    if (_c?.files?.rnv?.package?.version) {
        _c.rnvVersion = _c.files.rnv.package.version;
        str += printIntoBox(`      Version: ${currentChalk.green(_c.rnvVersion)}`, 1);
        if (_c.rnvVersion.includes('alpha')) {
            str += printIntoBox(
                `      ${currentChalk.yellow(
                    'WARNING: this is a prerelease version.'
                )}`,
                1
            );
        }
    }
    str += printIntoBox(`      ${currentChalk.grey('https://renative.org')}`, 1);
    str += printIntoBox(`      🚀 ${currentChalk.yellow('Firing up!...')}`, 1);
    str += printIntoBox(`      $ ${currentChalk.cyan(getCurrentCommand(true))}`, 1);
    if (_c?.timeStart) {
        str += printIntoBox(
            `      Start Time: ${_c.timeStart.toLocaleString()}`
        );
    }
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    console.log(str);
};

let _messages = [];
// let _currentCommand;
let _currentProcess;
let _isInfoEnabled = false;
let _infoFilter = [];
let _c;
let _isMono = false;
let _defaultColor;
let _highlightColor;
let _analytics;

export const configureLogger = (c, analytics) => {
    _messages = [];
    _c = c;
    _c.timeStart = new Date();
    _currentProcess = c.process;
    _isInfoEnabled = !!c.program.info;
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
    if (_messages && !_messages.includes(msg)) _messages.push(msg);
    if (!skipLog) console.log(`${msg}`);
};

const PRIVATE_PARAMS = ['-k', '--key'];

export const getCurrentCommand = (excludeDollar = false) => {
    if (!_c) return '_c is undefined';
    const argArr = _c.process.argv.slice(2);
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

export const logToSummary = (v) => {
    _messages.push(`\n${v}`);
};

export const logRaw = (...args) => {
    console.log.apply(null, args);
};

export const logSummary = (header = 'SUMMARY') => {
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

    let str = printBoxStart(`🚀  ${header} ${timeString}`, getCurrentCommand());
    if (_c) {
        str += printIntoBox(
            `ReNative Version: ${_highlightColor(_c.rnvVersion)}`,
            1
        );
        if (_c.files.project.package) {
            str += printIntoBox(
                `Project Name ($package.name): ${_highlightColor(
                    _c.files.project.package.name
                )}`,
                1
            );
            str += printIntoBox(
                `Project Version ($package.version): ${_highlightColor(
                    _c.files.project.package.version
                )}`,
                1
            );
        }

        if (_c.buildConfig?.workspaceID) {
            str += printIntoBox(
                `Workspace ($.workspaceID): ${_highlightColor(_c.buildConfig.workspaceID)}`,
                1
            );
        }
        if (_c?.platform) {
            str += printIntoBox(`Platform (-p): ${_highlightColor(_c.platform)}`, 1);
        }
        if (_c?.runtime?.engine) {
            let addon = '';
            if (_c?.platform) {
                addon = ` ($.platforms.${_c?.platform}.engine)`;
            }
            str += printIntoBox(`Engine${addon}: ${
                _highlightColor(_c.runtime.engine?.getId?.())
            }`, 1);
        }
        if (_c.buildConfig?._meta?.currentAppConfigId) {
            str += printIntoBox(
                `App Config (-c): ${_highlightColor(
                    _c.buildConfig._meta?.currentAppConfigId
                )}`,
                1
            );
        }
        if (_c.runtime?.scheme) {
            str += printIntoBox(
                `Build Scheme (-s): ${_highlightColor(_c.runtime?.scheme)}`,
                1
            );
        }
        if (_c?.runtime?.bundleAssets) {
            str += printIntoBox(
                `Bundle assets ($.platforms.${_c?.platform}.bundleAssets): ${
                    _highlightColor(!!_c.runtime?.bundleAssets)}`,
                1
            );
        }
        if (_c.runtime?.target) {
            str += printIntoBox(
                `Target (-t): ${_highlightColor(_c.runtime?.target)}`,
                1
            );
        }
        if (_c.program?.reset) {
            str += printIntoBox(
                `Reset Project (-r): ${_highlightColor(!!_c.program?.reset)}`,
                1
            );
        }
        if (_c.program?.resetHard) {
            str += printIntoBox(
                `Reset Project and Assets (-R): ${_highlightColor(!!_c.program?.resetHard)}`,
                1
            );
        }
        if (_c?.runtime?.supportedPlatforms?.length) {
            const plats = _c.runtime.supportedPlatforms.map(v => `${v.platform}${v.isConnected ? '' : '(ejected)'}`);
            str += printArrIntoBox(plats, 'Supported Platforms: ');
        }

        if (_c?.files?.project?.config?.defaults) {
            const defaultProjectConfigs = _c.files.project.config.defaults;
            if (defaultProjectConfigs?.template) {
                str += printIntoBox(
                    `Master Template: ${_highlightColor(
                        defaultProjectConfigs.template
                    )}`,
                    1
                );
            }
        }

        if (_c.process) {
            const envString = `${_c.process.platform} | ${_c.process.arch} | node v${_c.process.versions?.node}`;
            str += printIntoBox(`Env Info: ${currentChalk.gray(envString)}`, 1);
        }

        if (_c.timeEnd) {
            str += printIntoBox(
                `Executed Time: ${currentChalk.yellow(
                    _msToTime(_c.timeEnd - _c.timeStart)
                )}`,
                1
            );
        }
    }

    str += printIntoBox('');
    str += logContent.replace(/\n\s*\n\s*\n/g, '\n\n');
    str += printIntoBox('');
    if (_c?.runtime?.platformBuildsProjectPath) {
        str += printIntoBox('Project location:');
        str += printIntoBox(`${currentChalk.cyan(_sanitizePaths(_c.runtime.platformBuildsProjectPath))}`, 1);
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

export const setCurrentJob = () => {
    // _currentCommand = job;
};

const _getCurrentTask = () => (_c?._currentTask ? currentChalk.grey(` [${_c._currentTask}]`) : '');

const _sanitizePaths = (msg) => {
    if (msg?.replace && _c?.paths?.project?.dir) {
        return msg.replace(new RegExp(_c.paths.project.dir, 'g'), '.');
    }
    return msg;
};

const TASK_COUNTER = {};

export const logTask = (task, customChalk) => {
    if (!TASK_COUNTER[task]) TASK_COUNTER[task] = 0;
    TASK_COUNTER[task] += 1;
    const taskCount = currentChalk.grey(`[${TASK_COUNTER[task]}]`);
    let msg = '';
    if (typeof customChalk === 'string') {
        msg = `${currentChalk.green(`[ task ]${
            _getCurrentTask()} ${task}`)}${taskCount} ${currentChalk.grey(customChalk)}`;
    } else if (customChalk) {
        msg = customChalk(`[ task ]${_getCurrentTask()} ${task}${taskCount}`);
    } else {
        msg = currentChalk.green(`[ task ]${_getCurrentTask()} ${task}${taskCount}`);
    }

    console.log(_sanitizePaths(msg));
};


export const logInitTask = (task, customChalk) => {
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
    console.log(`${currentChalk.rgb(127, 255, 212)(`[ hook ]${_getCurrentTask()} ${
        hook}`)} ${currentChalk.grey(_sanitizePaths(msg))}`);
};

export const logWarning = (msg) => {
    logAndSave(currentChalk.yellow(`[ warn ]${_getCurrentTask()} ${_sanitizePaths(msg)}`));
};

export const logInfo = (msg) => {
    console.log(currentChalk.cyan(`[ info ]${_getCurrentTask()} ${_sanitizePaths(msg)}`));
};

export const logDebug = (...args) => {
    if (_isInfoEnabled) {
        if (_infoFilter) {
            const firstArg = args[0];

            if (_infoFilter.filter(v => firstArg?.includes?.(v)).length) {
                console.log.apply(null, args);
            }
        } else {
            console.log.apply(null, args);
        }
    }
};

export const isInfoEnabled = () => _isInfoEnabled;

export const logComplete = (isEnd = false) => {
    console.log(currentChalk.bold.white(`\n ${RNV} - Done! 🚀`));
    if (isEnd) logEnd(0);
};

export const logSuccess = (msg) => {
    logAndSave(currentChalk.magenta(`[ success ]${_getCurrentTask()} ${_sanitizePaths(msg)}`));
};

export const logError = (e, isEnd = false, skipAnalytics = false) => {
    if (!skipAnalytics && !!_analytics) {
        _analytics.captureException(e);
    }

    if (e && e.message) {
        logAndSave(
            currentChalk.red(`[ error ]${_getCurrentTask()} ${e.message}\n${e.stack}`),
            isEnd
        );
    } else {
        logAndSave(currentChalk.red(`[ error ]${_getCurrentTask()} ${e}`), isEnd);
    }
    _c.runtime.keepSessionActive = false;
    if (isEnd) logEnd(1);
};

export const logEnd = (code) => {
    logSummary();
    if (_currentProcess && !!_analytics) {
        _analytics.teardown().then(() => {
            _currentProcess.exit(code);
        });
    }
};

export const logInitialize = () => {
    logWelcome();
};

export const logAppInfo = (c) => {
    logInfo(`Current App Config: ${currentChalk.bold.white(
        c.runtime.appId
    )}`);
};

export const printIntoBox = (str2, intent = 0) => {
    let output = _defaultColor('│  ');
    let chalkIntend = intent;
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
    endLine
        += '                                                                               │\n';
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
                output += printIntoBox(
                    `${_defaultColor(prefix)}${_defaultColor(stringArr)}`,
                    2
                );
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
        output += printIntoBox(
            `${_defaultColor(prefix)}${_defaultColor(stringArr.slice(0, -2))}`,
            2
        );
    } else {
        output += printIntoBox(_defaultColor(stringArr.slice(0, -2)), 1);
    }

    return output;
};

export const printBoxStart = (str, str2) => {
    let output = _defaultColor(
        '┌──────────────────────────────────────────────────────────────────────────────┐\n'
    );
    output += printIntoBox(str);
    output += printIntoBox(str2 || '');
    output += _defaultColor(
        '├──────────────────────────────────────────────────────────────────────────────┤\n'
    );
    return output;
};

export const printBoxEnd = () => _defaultColor(
    '└──────────────────────────────────────────────────────────────────────────────┘'
);

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
    logInitialize
};
