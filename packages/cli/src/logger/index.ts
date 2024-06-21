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
    RnvApiChalkFn,
} from '@rnv/core';
import path from 'path';

const ICN_ROCKET = isSystemWin ? 'RNV' : '🚀';
// const ICN_UNICORN = isSystemWin ? 'unicorn' : '🦄';
const _chalkCols = generateDefaultChalk();
const _chalkMono = {
    ..._chalkCols,
};

const colorBlue = { r: 10, g: 116, b: 230 }; // '#0a74e6'

let currentChalk: RnvApiChalk = _chalk;
let chalkBlue: any = _chalk.rgb(colorBlue.r, colorBlue.g, colorBlue.b);

// const RNV = 'ReNative';
const PRIVATE_PARAMS = ['-k', '--key'];
let _isInfoEnabled = false;
let _infoFilter: Array<string> = [];
// let _c: RnvContext;
// let _isMono = false;
let _defaultColor: any = _chalkCols.white;
let _highlightColor = _chalkCols.white;
// let _analytics: AnalyticsApi;
let _jsonOnly: boolean;

export const chalk = (): RnvApiChalk => currentChalk || _chalk;

export const logInitialize = () => {
    // cnf();
    const ctx = getContext();

    _isInfoEnabled = !!ctx.program.opts().info;
    _jsonOnly = !!ctx.program.opts().json;
    _infoFilter = ctx.program.opts().info?.split?.(',');
    // _analytics = analytics;

    if (ctx.program.opts().mono) {
        currentChalk = _chalkMono;
        chalkBlue = _chalkMono;
    }
    _updateDefaultColors();
    // RNV = getCurrentCommand();
    if (!_jsonOnly) logWelcome();
};

export const logWelcome = () => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
    const shortLen = 64;
    // prettier-ignore
    let str = _defaultColor(`
┌─────────────────────────────────────────────────────────────────┐
│ ${chalkBlue('██████╗')} ███████╗${chalkBlue('███╗   ██╗')} █████╗ ████████╗██╗${chalkBlue('██╗   ██╗')}███████╗ │
│ ${chalkBlue('██╔══██╗')}██╔════╝${chalkBlue('████╗  ██║')}██╔══██╗╚══██╔══╝██║${chalkBlue('██║   ██║')}██╔════╝ │
│ ${chalkBlue('██████╔╝')}█████╗  ${chalkBlue('██╔██╗ ██║')}███████║   ██║   ██║${chalkBlue('██║   ██║')}█████╗   │
│ ${chalkBlue('██╔══██╗')}██╔══╝  ${chalkBlue('██║╚██╗██║')}██╔══██║   ██║   ██║${chalkBlue('╚██╗ ██╔╝')}██╔══╝   │
│ ${chalkBlue('██║  ██║')}███████╗${chalkBlue('██║ ╚████║')}██║  ██║   ██║   ██║${chalkBlue(' ╚████╔╝ ')}███████╗ │
│ ${chalkBlue('╚═╝  ╚═╝')}╚══════╝${chalkBlue('╚═╝  ╚═══╝')}╚═╝  ╚═╝   ╚═╝   ╚═╝${chalkBlue('  ╚═══╝  ')}╚══════╝ │
`);

    if (ctx.files?.rnv?.package?.version) {
        ctx.rnvVersion = ctx.files.rnv.package.version;
        str += printIntoBox(
            currentChalk.grey(
                `${ICN_ROCKET} v:${ctx.rnvVersion} | ${'renative.org'} | ${ctx.timeStart.toLocaleString()}`
            ),
            shortLen
        );
        if (ctx.rnvVersion?.includes?.('alpha')) {
            str += printIntoBox(`${currentChalk.yellow('WARNING: this is a prerelease version.')}`, shortLen);
        }
    }
    // str += printIntoBox(
    //     `${currentChalk.grey('https://renative.org')} | Start Time: ${currentChalk.grey(
    //         ctx.timeStart.toLocaleString()
    //     )}`,
    //     shortLen
    // );
    // str += printIntoBox(`      ${ICN_ROCKET} ${currentChalk.yellow('Firing up!...')}`);
    str += printIntoBox(`$ ${currentChalk.bold(getCurrentCommand(true))}`, shortLen);
    if (ctx.timeStart) {
        // str += printIntoBox(`      Start Time: ${currentChalk.grey(ctx.timeStart.toLocaleString())}`);
    }
    // str += printIntoBox('');
    // str += printBoxEnd();
    str += _defaultColor('└─────────────────────────────────────────────────────────────────┘');
    // str += '\n';

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
//     // ctx.logging.logMessages = [];

//     // _c = c;
//     // if (!ctx.timeStart) ctx.timeStart = new Date();
//     _currentProcess = c.process;
//     _isInfoEnabled = !!c.program.opts().info;
//     _jsonOnly = !!c.program.opts().json;
//     _infoFilter = c.program.opts().info?.split?.(',');
//     // _isMono = c.program.opts().mono;
//     _analytics = analytics;
//     // if (_isMono) {
//     //     currentChalk = _chalkMono;
//     // }
//     // _updateDefaultColors();
//     // RNV = getCurrentCommand();
// };

const _updateDefaultColors = () => {
    _defaultColor = currentChalk;
    _highlightColor = currentChalk.bold; //currentChalk.bold;
};
_updateDefaultColors();

export const logAndSave = (msg: string, skipLog?: boolean) => {
    const ctx = getContext();
    if (ctx.logging?.logMessages && !ctx.logging?.logMessages.includes(msg)) ctx.logging?.logMessages.push(msg);
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

export const logToSummary = (v: string) => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
    const _v = _sanitizePaths(v);
    ctx.logging.logMessages.push(`\n${_v}`);
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

export const logSummary = (opts?: { header?: string; headerStyle?: 'success' | 'warning' | 'error' | 'none' }) => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
    if (_jsonOnly || ctx.program?.opts().noSummary) return;

    if (ctx.paths.project.configExists && !ctx.paths.IS_NPX_MODE && !ctx.paths.IS_LINKED) {
        logAndSave(chalk().yellow('You are trying to run global rnv command in your current project.'), true);
        logAndSave(chalk().yellow('This might lead to unexpected behaviour.'), true);
        logAndSave(chalk().yellow('Run your rnv command with npx prefix:'), true);
        logAndSave(chalk().bold('npx ' + getCurrentCommand(true)), true);
    }

    let logContent = ''; //= printIntoBox(`All good as ${ICN_UNICORN} `);
    if (ctx.logging.logMessages && ctx.logging.logMessages.length) {
        logContent = '';
        ctx.logging.logMessages.forEach((m) => {
            logContent += `│ ${m}\n`;
        });
    }

    let timeString = '';
    ctx.timeEnd = new Date();
    timeString = `| ${ctx.timeEnd.toLocaleString()}`;

    // let envString = '';
    // if (ctx.process) {
    //     envString = `${ctx.process.platform} | ${ctx.process.arch} | node v${ctx.process.versions?.node}`;
    // }
    const defaultHeaderStyle = ctx.logging.containsError
        ? 'error'
        : ctx.logging.containsWarning
        ? 'warning'
        : 'success';
    const headerStyle = opts?.headerStyle || defaultHeaderStyle;

    const headerPrefix =
        headerStyle === 'success' ? '✔ ' : headerStyle === 'warning' ? '⚠ ' : headerStyle === 'error' ? '⨯ ' : '';
    const headerTextPlain = `${headerPrefix}${opts?.header || 'SUMMARY'}`;
    const headerChalk =
        headerStyle === 'success'
            ? currentChalk.green.bold
            : headerStyle === 'warning'
            ? currentChalk.yellow.bold
            : headerStyle === 'error'
            ? currentChalk.green.red
            : (v: string) => v;
    let str = printBoxStart(
        `${headerChalk(headerTextPlain)} ${timeString} | rnv@${ctx.rnvVersion}`,
        getCurrentCommand()
    );

    // str += printIntoBox(`ReNative Version: ${_highlightColor(ctx.rnvVersion)}`);
    if (ctx.files?.project?.package?.name && ctx.files?.project?.package?.version) {
        str += printIntoBox(
            `Project: ${currentChalk.gray(`${ctx.files.project.package.name}@${ctx.files.project.package.version}`)}`
        );
        // str += printIntoBox(`Project Version: ${currentChalk.gray(ctx.files.project.package.version)}`);
    }

    if (ctx.buildConfig?.workspaceID) {
        str += printIntoBox(`Workspace: ${currentChalk.gray(ctx.buildConfig.workspaceID)}`);
    }
    if (ctx.platform) {
        str += printIntoBox(`Platform (-p): ${_highlightColor(ctx.platform)}`);
    }
    if (ctx.runtime?.engine) {
        // let addon = '';
        // if (ctx.platform) {
        //     addon = ` ($.platforms.${ctx.platform}.engine)`;
        // }
        str += printIntoBox(`Engine: ${currentChalk.gray(ctx.runtime?.engine?.id || '')}`);
    }
    if (ctx.runtime?.currentTemplate) {
        str += printIntoBox(`Template: ${currentChalk.gray(ctx.runtime?.currentTemplate)}`);
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
    if (ctx.program?.opts()?.reset) {
        str += printIntoBox(`Reset Project (-r): ${_highlightColor(!!ctx.program?.opts()?.reset)}`);
    }
    if (ctx.program?.opts()?.resetHard) {
        str += printIntoBox(`Reset Project and Assets (-R): ${_highlightColor(!!ctx.program?.opts()?.resetHard)}`);
    }
    if (ctx.runtime?.availablePlatforms?.length) {
        // const plats = ctx.runtime.availablePlatforms.map((v) => `${currentChalk.gray(v)}`);
        // str += printArrIntoBox(plats, 'Supported Platforms: ');

        str += printIntoBox(`Supported Platforms: ${currentChalk.gray(ctx.runtime.availablePlatforms.join(', '))}`);
    }

    if (ctx.process) {
        const envString = `${ctx.process.platform} | ${ctx.process.arch} | node v${ctx.process.versions?.node}`;
        str += printIntoBox(`Env Info: ${currentChalk.gray(envString)}`);
    }

    if (ctx.timeEnd) {
        str += printIntoBox(
            `Executed Time: ${currentChalk.gray(_msToTime(ctx.timeEnd.getTime() - ctx.timeStart.getTime()))}`
        );
    }

    // str += printIntoBox('');

    str += logContent.replace(/\n\s*\n\s*\n/g, '\n\n');

    // str += printIntoBox('');
    if (ctx.runtime?.platformBuildsProjectPath) {
        str += printIntoBox(
            `Project location: ${currentChalk.gray(_sanitizePaths(ctx.runtime.platformBuildsProjectPath || ''))}`
        );
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
    return ctx._currentTask ? currentChalk.grey(`○ ${ctx._currentTask}:`) : '';
};

const CWD_ARR: { path: string; relative: string }[] = [];

const _generateRelativePaths = () => {
    const cwd = process.cwd();
    const cwdArr = cwd.split(path.sep);
    let relativeUp = '.';
    for (let i = 1; i < cwdArr.length; i++) {
        const absoluteUp = path.join(cwd, relativeUp).normalize();
        CWD_ARR.push({ path: absoluteUp, relative: relativeUp });
        relativeUp += i > 1 ? '/..' : '.';
    }
};

_generateRelativePaths();

const _sanitizePaths = (msg: string) => {
    // const ctx = getContext();
    // let dir
    // const config = ctx.files?.project?.config;
    // if(config && config.isMonorepo) {
    //     if()
    // }

    if (msg?.replace) {
        CWD_ARR.forEach((v) => {
            msg = msg.replace(new RegExp(v.path, 'g'), v.relative);
        });
        // return msg
        //     .replace(new RegExp(CWD, 'g'), '.')
        //     .replace(new RegExp(CWD_UP, 'g'), '..')
        //     .replace(new RegExp(CWD_UP_UP, 'g'), '../..');
    }
    return msg;
};

const TASK_COUNTER: Record<string, number> = {};

export const logTask = (task: string, customChalk?: string | RnvApiChalkFn) => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
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
        msg = `${currentChalk.green(`[task]${_getCurrentTask()}`)} ${task}${taskCount} ${currentChalk.grey(
            customChalk
        )}`;
    } else if (customChalk) {
        msg = customChalk(`[task]${_getCurrentTask()} ${task}${taskCount}`);
    } else {
        msg = `${currentChalk.green(`[task]${_getCurrentTask()}`)} ${task}${taskCount}`;
    }

    if (_isInfoEnabled) {
        // TODO: temporary. will be activated under different flag
        console.log(_sanitizePaths(msg));
    }
};

export const logDefault = (task: string, customChalk?: string | RnvApiChalkFn) => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
    const taskCount = getLogCounter(task);

    if (_jsonOnly) {
        return _printJson({
            type: 'log',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(typeof customChalk === 'string' ? customChalk : task)),
        });
    }

    let msg = '';
    if (typeof customChalk === 'string') {
        msg = `[log]${_getCurrentTask()} ${task}${taskCount} ${currentChalk.grey(customChalk)}`;
    } else if (customChalk) {
        msg = customChalk(`[log]${_getCurrentTask()} ${task} ${taskCount}`);
    } else {
        msg = `[log]${_getCurrentTask()} ${task} ${taskCount}`;
    }

    if (_isInfoEnabled) {
        // TODO: temporary. will be activated under different flag
        console.log(_sanitizePaths(msg));
    }
};

const getLogCounter = (task: string, skipAddition = false) => {
    if (!TASK_COUNTER[task]) TASK_COUNTER[task] = 0;
    if (!skipAddition) {
        TASK_COUNTER[task] += 1;
    }

    const taskCount = currentChalk.grey(`↺${TASK_COUNTER[task]}`);
    return taskCount;
};

export const logInitTask = (task: string) => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
    const taskCount = getLogCounter(task);

    if (_jsonOnly) {
        return _printJson({
            type: 'taskInit',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(task)),
        });
    }

    const msg = `${chalkBlue.bold('task:')} ○ ${task} ${taskCount}`;

    console.log(msg);
};

type PrintJsonPayload = {
    type: string;
    task?: string;
    message: string;
    hook?: string;
    level?: string;
};

export const logExitTask = (task: string) => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
    if (_jsonOnly) {
        return _printJson({
            type: 'taskExit',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(task)),
        });
    }
    // const taskCount = getLogCounter(task, true);
    const msg = `${currentChalk.green('task:')} ${currentChalk.green('✔')} ${task}`;

    console.log(msg);
};

export const logHook = (hook = '', msg = '') => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
    if (_jsonOnly) {
        const payload: PrintJsonPayload = { type: 'hook', hook, message: stripAnsi(_sanitizePaths(msg)) };
        if (_getCurrentTask()) payload.task = stripAnsi(_getCurrentTask());
        return _printJson(payload);
    }
    console.log(`${`[hook]`} ${_sanitizePaths(msg)}`);
};

export const logWarning = (msg: string | boolean | unknown) => {
    const ctx = getContext();
    const msgSn = typeof msg === 'string' ? _sanitizePaths(msg) : String(msg);
    if (_jsonOnly) {
        return _printJson({
            type: 'log',
            level: 'warning',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(msgSn),
        });
    }
    ctx.logging.containsWarning = true;
    logAndSave(currentChalk.yellow(`warn: ${_getCurrentTask()} ${msgSn}`));
};

export const logInfo = (msg: string) => {
    const ctx = getContext();
    if (ctx.program?.opts().help) return;
    if (_jsonOnly) {
        return _printJson({
            type: 'log',
            level: 'info',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(msg)),
        });
    }
    console.log(`${currentChalk.bold('info:')} ${_sanitizePaths(msg)}`);
};

export const logDebug = (...args: Array<string>) => {
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

export const logSuccess = (msg: string) => {
    if (_jsonOnly) {
        return _printJson({
            type: 'success',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(msg)),
        });
    }
    logAndSave(`${currentChalk.magenta(`info: ✔`)} ${_sanitizePaths(msg)}`);
};

export const logError = (e: Error | string | unknown, opts?: { skipAnalytics: boolean }) => {
    let err = '';
    if (typeof e === 'string') {
        err = e;
    } else if (e instanceof Error) {
        err = e.message;
    }
    const ctx = getContext();
    const api = getApi();
    if (!opts?.skipAnalytics) {
        const extra = {
            command: getCurrentCommand(),
            version: ctx.rnvVersion,
            engine: ctx.runtime?.engine?.id,
            platform: ctx.platform,
            bundleAssets: !!ctx.runtime?.bundleAssets,
            os: ctx.process?.platform,
            arch: ctx.process?.arch,
            node: ctx.process?.versions?.node,
        };
        api.analytics.captureException(err, { extra });
    }
    if (ctx.logging) {
        ctx.logging.containsError = true;
    }

    if (_jsonOnly) {
        _printJson({
            type: 'log',
            level: 'error',
            task: stripAnsi(_getCurrentTask()),
            message: stripAnsi(_sanitizePaths(err)),
        });
    } else if (e && e instanceof Error) {
        logAndSave(currentChalk.red(`error: ⨯ ${_getCurrentTask()} ${e.stack || e}\n`));
    } else {
        logAndSave(currentChalk.red(`error: ⨯ ${_getCurrentTask()} ${e}`));
    }
};

export const logAppInfo = (c: RnvContext) => {
    if (!_jsonOnly) {
        logInfo(`Current app config: ${currentChalk.bold(c.runtime.appId)}`);
    }
};

export const printIntoBox = (str: string, maxLen = 64) => {
    let output = _defaultColor('│ ');

    const strLenDiff = str.length - stripAnsi(str).length;
    output += _defaultColor(str);
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
    let output = _defaultColor('┌─────────────────────────────────────────────────────────────────┐\n');
    output += printIntoBox(str);
    output += printIntoBox(str2 || '');
    output += _defaultColor('├─────────────────────────────────────────────────────────────────┤\n');
    return output;
};

export const printBoxEnd = () => _defaultColor('└─────────────────────────────────────────────────────────────────┘');

const Logger: RnvApiLogger = {
    logHook,
    logInfo,
    logTask,
    logError,
    logDebug,
    logAppInfo,
    logDefault,
    logWarning,
    logSuccess,
    logWelcome,
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
