/* eslint-disable no-console */
import _chalk from 'chalk';
import {
    RnvContext,
    getApi,
    getContext,
    isSystemWin,
    generateDefaultChalk,
    RnvApiLogger,
    RnvApiChalk,
} from '@rnv/core';

const ICN_ROCKET = isSystemWin ? 'RNV' : '🚀';
const ICN_UNICORN = isSystemWin ? 'unicorn' : '🦄';
const _chalkCols = generateDefaultChalk();
const _chalkMono: any = {
    ..._chalkCols,
};
let currentChalk: RnvApiChalk = _chalk;
let RNV = 'ReNative';
const PRIVATE_PARAMS = ['-k', '--key'];
let _currentProcess: any;
let _isInfoEnabled = false;
let _infoFilter: Array<string> = [];
// let _c: RnvContext;
// let _isMono = false;
let _defaultColor = _chalkCols.white;
let _highlightColor = _chalkCols.white;
// let _analytics: AnalyticsApi;
let _jsonOnly: boolean;

export const chalk = (): RnvApiChalk => currentChalk || _chalk;

export const logInitialize = () => {
    // cnf();
    const ctx = getContext();

    _currentProcess = ctx.process;
    _isInfoEnabled = !!ctx.program.info;
    _jsonOnly = !!ctx.program.json;
    _infoFilter = ctx.program.info?.split?.(',');
    // _analytics = analytics;

    if (ctx.program.mono) {
        currentChalk = _chalkMono;
    }
    _updateDefaultColors();
    RNV = getCurrentCommand();
    if (!_jsonOnly) logWelcome();
};

export const logWelcome = () => {
    const ctx = getContext();
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

    if (ctx.files?.rnv?.package?.version) {
        ctx.rnvVersion = ctx.files.rnv.package.version;
        str += printIntoBox(`      Version: ${currentChalk.green(ctx.rnvVersion)}`);
        if (ctx.rnvVersion?.includes?.('alpha')) {
            str += printIntoBox(`      ${currentChalk.yellow('WARNING: this is a prerelease version.')}`);
        }
    }
    str += printIntoBox(`      ${currentChalk.grey('https://renative.org')}`);
    str += printIntoBox(`      ${ICN_ROCKET} ${currentChalk.yellow('Firing up!...')}`);
    str += printIntoBox(`      $ ${currentChalk.cyan(getCurrentCommand(true))}`);
    if (ctx.timeStart) {
        str += printIntoBox(`      Start Time: ${currentChalk.grey(ctx.timeStart.toLocaleString())}`);
    }
    str += printIntoBox('');
    str += printBoxEnd();
    str += '\n';

    console.log(str);
};

function ansiRegex({ onlyFirst = false } = {}) {
    const pattern = [
        '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
        '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
    ].join('|');

    return new RegExp(pattern, onlyFirst ? undefined : 'g');
}

export function stripAnsi(string: string) {
    if (typeof string !== 'string') {
        throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
    }

    return string.replace(ansiRegex(), '');
}

// const cnf = () => {
//     if (!_c) {
//         _configureLogger(global.RNV_CONFIG, global.RNV_ANALYTICS);
//     }
//     return _c;
// };

// const _configureLogger = (c: RnvContext, analytics: AnalyticsApi) => {
//     // ctx.logMessages = [];

//     // _c = c;
//     // if (!ctx.timeStart) ctx.timeStart = new Date();
//     _currentProcess = c.process;
//     _isInfoEnabled = !!c.program.info;
//     _jsonOnly = !!c.program.json;
//     _infoFilter = c.program.info?.split?.(',');
//     // _isMono = c.program.mono;
//     _analytics = analytics;
//     // if (_isMono) {
//     //     currentChalk = _chalkMono;
//     // }
//     // _updateDefaultColors();
//     // RNV = getCurrentCommand();
// };

const _updateDefaultColors = () => {
    _defaultColor = currentChalk.gray;
    _highlightColor = currentChalk.green;
};
_updateDefaultColors();

export const logAndSave = (msg: string, skipLog?: boolean) => {
    const ctx = getContext();
    if (ctx.logMessages && !ctx.logMessages.includes(msg)) ctx.logMessages.push(msg);
    if (!skipLog) console.log(`${msg}`);
};

const _printJson = (obj: PrintJsonPayload) => {
    // sanitize
    if (obj.task) {
        obj.task = obj.task.trim().replace('[', '').replace(']', '');
    }
    console.log(JSON.stringify(obj));
};

export const getCurrentCommand = (excludeDollar = false) => {
    const ctx = getContext();

    const argArr = ctx.process.argv.slice(2);
    let hideNext = false;
    const output = argArr
        .map((v: string) => {
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
    const npx = ctx.paths.IS_NPX_MODE ? 'npx ' : '';
    return `${dollar}${npx}rnv ${output}`;
};

export const logToSummary = (v: string, sanitizePaths?: () => string) => {
    const ctx = getContext();
    const _v = sanitizePaths ? _sanitizePaths(v) : v;
    ctx.logMessages.push(`\n${_v}`);
};

export const logRaw = (...args: Array<string>) => {
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
    const ctx = getContext();

    if (_jsonOnly) return;

    if (ctx.paths.project.configExists && !ctx.paths.IS_NPX_MODE) {
        logAndSave(chalk().yellow('You are trying to run global rnv command in your current project.'), true);
        logAndSave(chalk().yellow('This might lead to unexpected behaviour.'), true);
        logAndSave(chalk().yellow('Run your rnv command with npx prefix:'), true);
        logAndSave(chalk().white('npx ' + getCurrentCommand(true)), true);
    }

    let logContent = printIntoBox(`All good as ${ICN_UNICORN} `);
    if (ctx.logMessages && ctx.logMessages.length) {
        logContent = '';
        ctx.logMessages.forEach((m) => {
            logContent += `│ ${m}\n`;
        });
    }

    let timeString = '';
    ctx.timeEnd = new Date();
    timeString = `| ${ctx.timeEnd.toLocaleString()}`;

    let str = printBoxStart(`${ICN_ROCKET}  ${header} ${timeString}`, getCurrentCommand());

    str += printIntoBox(`ReNative Version: ${_highlightColor(ctx.rnvVersion)}`);
    if (ctx.files?.project?.package) {
        str += printIntoBox(`Project Name ($package.name): ${_highlightColor(ctx.files.project.package.name)}`);
        str += printIntoBox(
            `Project Version ($package.version): ${_highlightColor(ctx.files.project.package.version)}`
        );
    }

    if (ctx.buildConfig?.workspaceID) {
        str += printIntoBox(`Workspace ($.workspaceID): ${_highlightColor(ctx.buildConfig.workspaceID)}`);
    }
    if (ctx.platform) {
        str += printIntoBox(`Platform (-p): ${_highlightColor(ctx.platform)}`);
    }
    if (ctx.runtime?.engine) {
        let addon = '';
        if (ctx.platform) {
            addon = ` ($.platforms.${ctx.platform}.engine)`;
        }
        str += printIntoBox(`Engine${addon}: ${_highlightColor(ctx.runtime?.engine?.config?.id || '')}`);
    }
    if (ctx.runtime?.activeTemplate) {
        str += printIntoBox(`Template: ${_highlightColor(ctx.runtime?.activeTemplate)}`);
    }
    if (ctx.buildConfig?._meta?.currentAppConfigId) {
        str += printIntoBox(`App Config (-c): ${_highlightColor(ctx.buildConfig._meta?.currentAppConfigId)}`);
    }
    if (ctx.runtime?.scheme) {
        str += printIntoBox(`Build Scheme (-s): ${_highlightColor(ctx.runtime?.scheme)}`);
    }
    if (ctx.runtime?.bundleAssets) {
        str += printIntoBox(
            `Bundle assets ($.platforms.${ctx.platform}.bundleAssets): ${_highlightColor(!!ctx.runtime?.bundleAssets)}`
        );
    }
    if (ctx.runtime?.target) {
        str += printIntoBox(`Target (-t): ${_highlightColor(ctx.runtime?.target)}`);
    }
    if (ctx.program?.reset) {
        str += printIntoBox(`Reset Project (-r): ${_highlightColor(!!ctx.program?.reset)}`);
    }
    if (ctx.program?.resetHard) {
        str += printIntoBox(`Reset Project and Assets (-R): ${_highlightColor(!!ctx.program?.resetHard)}`);
    }
    if (ctx.runtime?.supportedPlatforms?.length) {
        const plats = ctx.runtime.supportedPlatforms.map((v) => `${v.platform}${v.isConnected ? '' : '(ejected)'}`);
        str += printArrIntoBox(plats, 'Supported Platforms: ');
    }

    if (ctx.files?.project?.config?.defaults) {
        const currentTemplate = ctx.files.project.config?.currentTemplate;
        if (currentTemplate) {
            str += printIntoBox(`Master Template: ${_highlightColor(currentTemplate)}`);
        }
    }

    if (ctx.process) {
        const envString = `${ctx.process.platform} | ${ctx.process.arch} | node v${ctx.process.versions?.node}`;
        str += printIntoBox(`Env Info: ${currentChalk.gray(envString)}`);
    }

    if (ctx.timeEnd) {
        str += printIntoBox(`Executed Time: ${_msToTime(ctx.timeEnd.getTime() - ctx.timeStart.getTime())}`);
    }

    str += printIntoBox('');

    str += logContent.replace(/\n\s*\n\s*\n/g, '\n\n');

    str += printIntoBox('');
    if (ctx.runtime?.platformBuildsProjectPath) {
        str += printIntoBox('Project location:');
        str += printIntoBox(`${currentChalk.cyan(_sanitizePaths(ctx.runtime.platformBuildsProjectPath || ''))}`);
    }
    str += printBoxEnd();

    console.log(str);
};

const _msToTime = (seconds: number) => {
    let s = seconds;
    const ms = s % 1000;
    s = (s - ms) / 1000;
    const secs = s % 60;
    s = (s - secs) / 60;
    const mins = s % 60;
    const hrs = (s - mins) / 60;

    return `${hrs}h:${mins}m:${secs}s:${ms}ms`;
};

const _getCurrentTask = () => {
    const ctx = getContext();
    return ctx._currentTask ? currentChalk.grey(` [${ctx._currentTask}]`) : '';
};

const _sanitizePaths = (msg: string) => {
    const ctx = getContext();
    // let dir
    // const config = ctx.files?.project?.config;
    // if(config && config.isMonorepo) {
    //     if()
    // }
    if (msg?.replace && ctx.paths?.project?.dir) {
        return msg.replace(new RegExp(ctx.paths.project.dir, 'g'), '.');
    }
    return msg;
};

const TASK_COUNTER: Record<string, number> = {};

export const logTask = (task: string, customChalk?: any) => {
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

export const logInitTask = (task: string, customChalk?: string | ((s: string) => string)) => {
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

type PrintJsonPayload = {
    type: string;
    task?: string;
    message: string;
    hook?: any;
    level?: string;
};

export const logExitTask = (task: string, customChalk?: (s: string) => string) => {
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
        const payload: PrintJsonPayload = { type: 'hook', hook, message: stripAnsi(_sanitizePaths(msg)) };
        if (_getCurrentTask()) payload.task = stripAnsi(_getCurrentTask());
        return _printJson(payload);
    }
    console.log(
        `${currentChalk.rgb(127, 255, 212)(`[ hook ]${_getCurrentTask()} ${hook}`)} ${currentChalk.grey(
            _sanitizePaths(msg)
        )}`
    );
};

export const logWarning = (msg: string | boolean) => {
    const msgSn = typeof msg === 'string' ? _sanitizePaths(msg) : String(msg);
    if (_jsonOnly) {
        return _printJson({
            type: 'log',
            level: 'warning',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(msgSn),
        });
    }
    logAndSave(currentChalk.yellow(`[ warn ]${_getCurrentTask()} ${msgSn}`));
};

export const logInfo = (msg: string) => {
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

export const logDebug = (...args: Array<any>) => {
    if (_isInfoEnabled) {
        if (_jsonOnly) {
            return _printJson({
                type: 'log',
                level: 'debug',
                task: stripAnsi(_getCurrentTask()),
                message: stripAnsi(_sanitizePaths(args.join(' '))),
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

export const logSuccess = (msg: string) => {
    if (_jsonOnly) {
        return _printJson({
            type: 'success',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(msg)),
        });
    }
    logAndSave(currentChalk.magenta(`[ success ]${_getCurrentTask()} ${_sanitizePaths(msg)}`));
};

export const logError = (e: Error | string, isEnd = false, skipAnalytics = false) => {
    const ctx = getContext();
    const api = getApi();
    if (!skipAnalytics) {
        const extra = {
            command: getCurrentCommand(),
            version: ctx.rnvVersion,
            engine: ctx.runtime?.engine?.config?.id,
            platform: ctx.platform,
            bundleAssets: !!ctx.runtime?.bundleAssets,
            os: ctx.process?.platform,
            arch: ctx.process?.arch,
            node: ctx.process?.versions?.node,
        };
        api.analytics.captureException(e, { extra });
    }

    if (_jsonOnly) {
        _printJson({
            type: 'log',
            level: 'error',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(e instanceof Error ? e.message : e)),
        });
    } else if (e && e instanceof Error && e.message) {
        logAndSave(currentChalk.red(`[ error ]${_getCurrentTask()} ${e.message}\n${e.stack}`), isEnd);
    } else {
        logAndSave(currentChalk.red(`[ error ]${_getCurrentTask()} ${e}`), isEnd);
    }

    ctx.runtime.keepSessionActive = false;
    if (isEnd) logEnd(1);
};

export const logEnd = (code: number) => {
    const api = getApi();
    if (!_jsonOnly) {
        logSummary();
    }

    if (_currentProcess) {
        api.analytics.teardown().then(() => {
            _currentProcess.exit(code);
        });
    }
};

export const logAppInfo = (c: RnvContext) => {
    if (!_jsonOnly) {
        logInfo(`Current App Config: ${currentChalk.bold.white(c.runtime.appId)}`);
    }
};

export const printIntoBox = (str: string) => {
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

export const printArrIntoBox = (arr: Array<string>, prefix = '') => {
    if (_jsonOnly) return arr.join(',');

    let output = '';
    let stringArr = '';
    let i = 0;
    arr.forEach((v) => {
        const l = i === 0 ? 60 - _defaultColor(prefix).length : 60;
        if (stringArr.length > l) {
            if (i === 0 && prefix.length) {
                output += printIntoBox(`${_defaultColor(prefix)}${_defaultColor(stringArr)}`);
            } else {
                output += printIntoBox(_defaultColor(stringArr));
            }

            stringArr = '';
            i++;
        }
        stringArr += `${v}, `;
        // stringArr[i] += `${c.platformDefaults[v].icon} ${currentChalk.white(v)}, `;
    });
    if (i === 0 && prefix.length) {
        output += printIntoBox(`${_defaultColor(prefix)}${_defaultColor(stringArr.slice(0, -2))}`);
    } else {
        output += printIntoBox(_defaultColor(stringArr.slice(0, -2)));
    }

    return output;
};

export const printBoxStart = (str: string, str2?: string) => {
    let output = _defaultColor('┌──────────────────────────────────────────────────────────────────────────────┐\n');
    output += printIntoBox(str);
    output += printIntoBox(str2 || '');
    output += _defaultColor('├──────────────────────────────────────────────────────────────────────────────┤\n');
    return output;
};

export const printBoxEnd = () =>
    _defaultColor('└──────────────────────────────────────────────────────────────────────────────┘');

const Logger: RnvApiLogger = {
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
    logAndSave,
    getCurrentCommand,
    logExitTask,
    logRaw,
    isInfoEnabled,
    logInitTask,
    logSummary,
    logToSummary,
    printArrIntoBox,
    printBoxEnd,
    printBoxStart,
    printIntoBox,
    chalk,
};

export default Logger;
