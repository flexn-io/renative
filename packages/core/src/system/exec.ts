/* eslint-disable no-control-regex */

import path from 'path';
import { access, accessSync, constants } from 'fs';
import execa, { ExecaChildProcess } from 'execa';
import NClient from 'netcat/client';
import { chalk, logDebug, logRaw, logError } from '../logger';
import { fsExistsSync } from './fs';
import { RnvContext } from '../context/types';
import { ExecCallback, ExecOptions } from './types';
import { getContext } from '../context/provider';
import { getApi } from '../api/provider';

const { exec, execSync } = require('child_process');

const FIRE_AND_FORGET: ExecOptions = {
    stdio: 'ignore', // Disable child_process output
    detached: true, // Killing rnv command will NOT kill process
    silent: true, // Disable spinner
    shell: true, // runs `command` inside of a shell. Uses `/bin/sh` on UNIX and `cmd.exe` on Windows
};

const NO_SPINNER_FULL_ERROR_SUMMARY: ExecOptions = {
    stdio: 'pipe', // pipe will print final error into SUMMARY box but nothing during execution
    detached: true, // Killing rnv command will NOT kill process
    silent: true, // Disable spinner
    shell: true, // runs `command` inside of a shell. Uses `/bin/sh` on UNIX and `cmd.exe` on Windows
};

const INHERIT_OUTPUT_NO_SPINNER: ExecOptions = {
    detached: false, // Killing command will kill process
    silent: true, // silent: true => will not show execa spinner
    stdio: 'inherit', // inherit will print during execution but no details in SUMMARY box
    shell: true, // runs `command` inside of a shell. Uses `/bin/sh` on UNIX and `cmd.exe` on Windows
    // mono: true,
};

const SPINNER_FULL_ERROR_SUMMARY: ExecOptions = {
    detached: false, // Killing command will kill process
    silent: false,
    stdio: 'pipe', // pipe will print final error into SUMMARY box but nothing during execution
    shell: true, // runs `command` inside of a shell. Uses `/bin/sh` on UNIX and `cmd.exe` on Windows
    mono: false,
};

export const ExecOptionsPresets = {
    // Do not await when using FIRE_AND_FORGET option
    FIRE_AND_FORGET,
    INHERIT_OUTPUT_NO_SPINNER,
    SPINNER_FULL_ERROR_SUMMARY,
    NO_SPINNER_FULL_ERROR_SUMMARY,
} as const;

const replaceOverridesInString = (string: string | undefined, overrides: Array<string>, mask: string) => {
    if (!string) return '';
    let replacedString = string;
    if (overrides?.length && replacedString?.replace) {
        overrides.forEach((v) => {
            const regEx = new RegExp(v, 'g');
            replacedString = replacedString.replace(regEx, mask);
        });
    }
    return replacedString;
};

/**
 *
 * Also accepts the Node's child_process exec/spawn options
 *
 * @typedef {Object} Opts
 * @property {Object} privateParams - private params that will be masked in the logs
 * @property {Boolean} silent - don't print anything
 * @property {Boolean} ignoreErrors - will print the loader but it will finish with a
 * checkmark regardless of the outcome. Also, it never throws a catch.
 * @property {Boolean} interactive - when you want to execute a command that requires user input
 *
 * Execute commands
 *
 * @param {String} command - command to be executed
 * @param {Opts} [opts={}] - the options for the command
 * @returns {Promise}
 *
 */
const _execute = (c: RnvContext, command: string | Array<string>, opts: ExecOptions = {}) => {
    const defaultOpts: ExecOptions = {
        stdio: 'pipe',
        localDir: path.resolve('./node_modules/.bin'),
        preferLocal: true,
        all: true,
        maxErrorLength: c.program?.maxErrorLength,
        mono: c.program?.mono || c.program?.json,
    };

    const blue2 = chalk().rgb(50, 50, 255).bold;

    const mergedOpts = { ...defaultOpts, ...opts };

    const printableEnv =
        opts.env && (c.program.info || c.program.printExec)
            ? Object.keys(opts.env)
                  .map((k) => `${k}=${opts?.env?.[k]}`)
                  .join(' ')
            : null;

    const commandAsString = Array.isArray(command) ? command.join(' ') : command;
    let cleanCommand = commandAsString;

    let interval: NodeJS.Timer;
    const intervalTimer = 30000; // 30s
    let timer = intervalTimer;
    const privateMask = '*******';
    const cleanRawCmd = opts.rawCommand?.args || [];

    if (cleanRawCmd.length) {
        cleanCommand += ` ${cleanRawCmd.join(' ')}`;
    }

    let logMessage = cleanCommand;
    const privateParams = mergedOpts.privateParams || [];
    if (privateParams?.length) {
        logMessage = replaceOverridesInString(commandAsString, privateParams, privateMask);
    }

    if (c.program.printExec) {
        let logMsg = printableEnv ? `${chalk().grey(printableEnv)} ${logMessage}` : logMessage;
        if (opts.cwd) {
            logMsg = `cd ${opts.cwd} ${chalk().cyan('&&')} ${logMsg}`;
        }
        logRaw(`${blue2('exec:')} ${blue2('○')} ${logMsg} ${blue2('○')}`);
    }

    logDebug(`_execute: ${logMessage}`);
    const { silent, mono, maxErrorLength, ignoreErrors } = mergedOpts;
    const spinner =
        !silent &&
        !mono &&
        getApi()
            .spinner({ text: `Executing: ${logMessage}` })
            .start('');
    // if (opts.interactive) {
    //     logRaw(`${chalk().green('✔')} Executing: ${logMessage}\n`);
    // }

    if (mono) {
        interval = setInterval(() => {
            logRaw(`Executing: ${logMessage} - ${timer / 1000}s`);
            timer += intervalTimer;
        }, intervalTimer);
    }
    let child: ExecaChildProcess;
    if (opts.rawCommand) {
        const { args } = opts.rawCommand;
        child = execa(commandAsString, args, mergedOpts);
    } else {
        child = execa.command(cleanCommand, mergedOpts);
    }

    if (!opts.detached) {
        c.runningProcesses.push(child);
    }

    const MAX_OUTPUT_LENGTH = 200;

    const printLastLine = (buffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
        const text = Buffer.from(buffer).toString().trim();
        const lastLine = text.split('\n').pop() || '';
        if (spinner !== false) {
            spinner.text = replaceOverridesInString(
                lastLine?.substring(0, MAX_OUTPUT_LENGTH),
                privateParams || [],
                privateMask
            );
        }

        if (lastLine?.length === MAX_OUTPUT_LENGTH) {
            if (spinner !== false) spinner.text += '...\n';
        }
    };

    if (c.program?.info && child?.stdout?.pipe) {
        child.stdout.pipe(process.stdout);
    } else if (spinner && child?.stdout?.on) {
        child.stdout.on('data', printLastLine);
    }

    return child
        .then((res) => {
            if (child?.stdout?.off) {
                spinner && child.stdout.off('data', printLastLine);
            }

            !silent && !mono && !!spinner && spinner.succeed(`Executing: ${logMessage}`);
            logDebug(replaceOverridesInString(res.all, privateParams, privateMask));
            interval && clearInterval(interval);
            c.runningProcesses.splice(c.runningProcesses.indexOf(child), 1);
            // logDebug(res);
            return res.stdout;
        })
        .catch((err) => {
            if (child?.stdout?.off) {
                spinner && child.stdout.off('data', printLastLine);
            }

            if (!silent && !mono && !ignoreErrors && !!spinner) {
                spinner.fail(`FAILED: ${logMessage}`);
            } // parseErrorMessage will return false if nothing is found, default to previous implementation
            logDebug(replaceOverridesInString(err.all, privateParams, privateMask));
            interval && clearInterval(interval);
            // logDebug(err);
            if (ignoreErrors && !silent && !mono && !!spinner) {
                spinner.succeed(`Executing: ${logMessage}`);
                return '';
            }

            let errMessage = '';

            if (!opts.stdio) {
                //In stdio mode all info received at summary so we want to skip doubles
                errMessage = parseErrorMessage(err.all, maxErrorLength);
            }

            if (!errMessage) {
                errMessage = '';
            } else {
                errMessage += '\n\n';
            }

            if (err.stack && !errMessage.includes(err.stack)) {
                errMessage += `${err.stack}\n\n`;
            }

            if (err.all && !errMessage.includes(err.all)) {
                errMessage += `${err.all}\n\n`;
            }

            if (err.message && !errMessage.includes(err.message)) {
                errMessage += `${err.message}\n\n`;
            }

            if (err.stderr && !errMessage.includes(err.stderr)) {
                errMessage += `${err.stderr}\n\n`;
            }

            errMessage = replaceOverridesInString(errMessage, privateParams, privateMask);
            c.runningProcesses.splice(c.runningProcesses.indexOf(child), 1);

            return Promise.reject(`COMMAND: \n\n${logMessage} \n\nFAILED with ERROR: \n\n${errMessage}`); // parseErrorMessage will return false if nothing is found, default to previous implementation
        });
};

/**
 *
 * Execute CLI command
 *
 * @param {Object} c - the trusty old c object
 * @param {String} cli - the cli to be executed
 * @param {String} command - the command to be executed
 * @param {Opts} [opts={}] - the options for the command
 * @returns {Promise}
 *
 */
const execCLI = (c: RnvContext, cli: string, command: string, opts: ExecOptions = {}) => {
    if (!c.program) {
        return Promise.reject('You need to pass c object as first parameter to execCLI()');
    }
    const p = c.cli[cli];

    if (!fsExistsSync(p)) {
        logDebug(
            `execCLI error: ${cli} | ${command}`,
            '\nCLI Config:\n',
            c.cli,
            '\nSDK Config:\n',
            c.buildConfig?.sdks
        );
        return Promise.reject(
            `Location of your cli ${chalk().bold(p)} does not exists. check your ${chalk().bold(
                c.paths.workspace.config
            )} file if your ${chalk().bold('sdks')} paths are correct`
        );
    }

    return _execute(c, `${p} ${command}`, { ...opts, shell: true });
};

/**
 *
 * Execute a plain command
 *
 * @param {String} command - the command to be executed
 * @param {Opts} [opts={}] - the options for the command
 * @returns {Promise}
 *
 */

const executeAsync = async (
    _c: RnvContext | string | Array<string>,
    _cmd?: string | Array<string> | ExecOptions,
    _opts?: ExecOptions
): Promise<string> => {
    // swap values if c is not specified and get it from it's rightful place, config :)
    let c: RnvContext;
    let cmd: string | Array<string> = '';
    let opts: ExecOptions = _opts || {};
    const isArg1Command = typeof _c === 'string' || Array.isArray(_c);
    if (isArg1Command) {
        cmd = _c;
        c = getContext();
    } else {
        c = _c;
    }

    const isArg2Command = typeof _cmd === 'string' || Array.isArray(_cmd);
    if (isArg2Command) {
        cmd = _cmd;
    } else if (_cmd) {
        opts = _cmd;
    }

    if (cmd.includes('npm') && process.platform === 'win32') {
        if (typeof cmd === 'string') {
            cmd.replace('npm', 'npm.cmd');
        } else {
            cmd = cmd.join(' ').replace('npm', 'npm.cmd');
            cmd = cmd.split(' ');
        }
    }
    // let cmdArr;
    // if (typeof cmd === 'string') {
    //     cmdArr = cmd.split('&&');
    // } else {
    //     cmdArr = cmd;
    // }

    // let result;
    // if (cmdArr.length) {
    //     for (let i = 0; i < cmdArr.length; i++) {
    //         // if (cmdArr[i].startsWith('cd ')) {
    //         //     // TODO: flaky. will need to improve
    //         //     const newCwd = path.join(CURRENT_DIR, cmdArr[i].replace('cd ', ''));
    //         //     opts.cwd = newCwd;
    //         // } else {
    //         //     await _execute(c, cmdArr[i], opts);
    //         // }
    //         result = await _execute(c, cmdArr[i], opts);
    //     }
    // }
    console.log('!!!!!!! cmd', _cmd, '!!!!!!! opts', _opts, '@@@@@@@@@@@');
    const result = await _execute(c, cmd, opts);
    return result;
};

export const execaCommand = (cmd: string, options?: execa.Options) => {
    return execa.command(cmd, options);
};

/**
 *
 * Connect to a local telnet server and execute a command
 *
 * @param {Number|String} port - where do you want me to connect to?
 * @param {String} command - the command to be executed once I'm connected
 * @returns {Promise}
 *
 */
const executeTelnet = (c: RnvContext, port: string, command: string) =>
    new Promise<string>((resolve) => {
        logDebug(`execTelnet: ${port} ${command}`);
        try {
            let output = '';
            const nc2 = new NClient();
            nc2.addr(c.runtime.localhost).port(parseInt(port, 10)).connect().send(`${command}\n`);
            nc2.on('data', (data: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>) => {
                const resp = Buffer.from(data).toString();
                output += resp;
                if (output.includes('OK')) nc2.close();
            });
            nc2.on('close', () => resolve(output));
        } catch (e) {
            logError(e);
            resolve('');
        }
    });

// Legacy error parser
// export const parseErrorMessage = (text, maxErrorLength = 800) => {
//     const errors = [];
//     const toSearch = /(exception|error|fatal|\[!])/i;
//
//     const extractError = (t) => {
//         const errorFound = t ? t.search(toSearch) : -1;
//         if (errorFound === -1) return errors.length ? errors.join(' ') : false; // return the errors or false if we found nothing at all
//         const usefulString = t.substring(errorFound); // dump first part of the string that doesn't contain what we look for
//         let extractedError = usefulString.substring(0, maxErrorLength);
//         if (extractedError.length === maxErrorLength) extractedError += '...'; // add elipsis if string is bigger than maxErrorLength
//         errors.push(extractedError); // save the error
//         const newString = usefulString.substring(100); // dump everything we processed and continue
//         return extractError(newString);
//     };
//
//     return extractError(text);
// };

export const parseErrorMessage = (text: string, maxErrorLength = 800) => {
    if (!text) return '';
    // Gradle specific
    const gradleFailIndex = text.indexOf('FAILURE: Build failed with an exception.');
    if (gradleFailIndex !== -1) {
        return text.substring(gradleFailIndex);
    }
    // NextJS Specific
    const nextFailIndex = text.indexOf('> Build error occurred');
    if (nextFailIndex !== -1) {
        return text.substring(nextFailIndex);
    }
    const toSearch = /(exception|error|fatal|\[!])/i;
    let arr = text.split('\n');

    let errFound = 0;
    arr = arr.filter((v) => {
        if (v === '') return false;
        // Cleaner iOS reporting
        if (
            v.includes('-Werror') ||
            v.includes('following modules are linked manually') ||
            v.includes('warn ') ||
            v.includes('note: ') ||
            v.includes('warning: ') ||
            v.includes('Could not find the following native modules') ||
            v.includes('⚠️') ||
            v.includes('/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain')
        ) {
            return false;
        }
        // Cleaner Android reporting
        if (
            v.includes('[DEBUG]') ||
            v.includes('[INFO]') ||
            v.includes('[LIFECYCLE]') ||
            v.includes('[WARN]') ||
            v.includes(':+HeapDumpOnOutOfMemoryError') ||
            v.includes('.errors.') ||
            v.includes('-exception-') ||
            v.includes('error_prone_annotations')
        ) {
            return false;
        }
        // Special Helper for iOS
        // if (v.endsWith('^')) {
        //     arr[i - 1] = chalk().red(arr[i - 1]);
        // }
        if (v.search(toSearch) !== -1) {
            errFound = 5;
            return true;
        }
        if (errFound > 0) {
            errFound -= 1;
            return true;
        }

        return false;
    });

    arr = arr.map((str) => {
        const v = str.replace(/\s{2,}/g, ' ');
        let extractedError = v.substring(0, maxErrorLength);
        if (extractedError.length === maxErrorLength) extractedError += '...';
        return extractedError;
    });

    return arr.join('\n');
};

const isUsingWindows = process.platform === 'win32';

const fileNotExists = (commandName: string, callback: (isError: boolean) => void) => {
    access(commandName, constants.F_OK, (err) => {
        callback(!err);
    });
};

const fileNotExistsSync = (commandName: string) => {
    try {
        accessSync(commandName, constants.F_OK);
        return false;
    } catch (e) {
        return true;
    }
};

const localExecutable = (commandName: string, callback?: ExecCallback) => {
    access(commandName, constants.F_OK | constants.X_OK, (err) => {
        callback && callback(null, !err);
    });
};

const localExecutableSync = (commandName: string) => {
    try {
        accessSync(commandName, constants.F_OK | constants.X_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const commandExistsUnix = (commandName: string, cleanedCommandName: string, callback?: ExecCallback) => {
    fileNotExists(commandName, (isFile: boolean) => {
        if (!isFile) {
            exec(
                `command -v ${cleanedCommandName} 2>/dev/null` + ` && { echo >&1 ${cleanedCommandName}; exit 0; }`,
                (_error: unknown, stdout: unknown) => {
                    callback && callback(null, !!stdout);
                }
            );
            return;
        }

        localExecutable(commandName, callback);
    });
};

const commandExistsWindows = (commandName: string, cleanedCommandName: string, callback?: ExecCallback) => {
    if (/[\x00-\x1f<>:"|?*]/.test(commandName)) {
        callback && callback(null, false);
        return;
    }
    exec(`where ${cleanedCommandName}`, (error: unknown) => {
        if (error !== null) {
            callback && callback(null, false);
        } else {
            callback && callback(null, true);
        }
    });
};

const commandExistsUnixSync = (commandName: string, cleanedCommandName: string) => {
    if (fileNotExistsSync(commandName)) {
        try {
            const stdout = execSync(
                `command -v ${cleanedCommandName} 2>/dev/null` + ` && { echo >&1 ${cleanedCommandName}; exit 0; }`
            );
            return !!stdout;
        } catch (error) {
            return false;
        }
    }
    return localExecutableSync(commandName);
};

const commandExistsWindowsSync = (commandName: string, cleanedCommandName: string) => {
    if (/[\x00-\x1f<>:"|?*]/.test(commandName)) {
        return false;
    }
    try {
        const stdout = execSync(`where ${cleanedCommandName}`, { stdio: [] });
        return !!stdout;
    } catch (error) {
        return false;
    }
};

let cleanInput = (_s: string) => {
    let s = _s;
    if (/[^A-Za-z0-9_/:=-]/.test(s)) {
        s = `'${s.replace(/'/g, "'\\''")}'`;
        s = s
            .replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
            .replace(/\\'''/g, "\\'"); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    return s;
};

if (isUsingWindows) {
    cleanInput = (s) => {
        const isPathName = /[\\]/.test(s);
        if (isPathName) {
            const dirname = `"${path.dirname(s)}"`;
            const basename = `"${path.basename(s)}"`;
            return `${dirname}:${basename}`;
        }
        return `"${s}"`;
    };
}

const commandExists = (commandName: string, callback?: ExecCallback) => {
    const cleanedCommandName = cleanInput(commandName);
    if (!callback && typeof Promise !== 'undefined') {
        return new Promise((resolve, reject) => {
            commandExists(commandName, (error, output) => {
                if (output) {
                    resolve(commandName);
                } else {
                    reject(error);
                }
            });
        });
    }
    if (isUsingWindows) {
        commandExistsWindows(commandName, cleanedCommandName, callback);
    } else {
        commandExistsUnix(commandName, cleanedCommandName, callback);
    }
};

const commandExistsSync = (commandName: string) => {
    const cleanedCommandName = cleanInput(commandName);
    if (isUsingWindows) {
        return commandExistsWindowsSync(commandName, cleanedCommandName);
    }
    return commandExistsUnixSync(commandName, cleanedCommandName);
};

// eslint-disable-next-line no-nested-ternary
const openCommand = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';

export const waitForExecCLI = async (
    c: RnvContext,
    cli: string,
    command: string,
    callback: (resp: string | true) => boolean
): Promise<boolean> => {
    let attempts = 0;
    const maxAttempts = 30;
    const CHECK_INTEVAL = 2000;
    const { maxErrorLength } = c.program;
    const spinner = getApi().spinner('Waiting for emulator to boot...').start('');

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            execCLI(c, cli, command, {
                silent: true,
                timeout: 10000,
                maxErrorLength,
            })
                .then((resp) => {
                    if (callback(resp)) {
                        clearInterval(interval);
                        spinner.succeed('');
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        spinner.fail("Can't connect to the running emulator. Try restarting it.");
                        return reject("Can't connect to the running emulator. Try restarting it.");
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        spinner.fail("Can't connect to the running emulator. Try restarting it.");
                        return reject("Can't connect to the running emulator. Try restarting it.");
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export { executeAsync, execCLI, commandExists, commandExistsSync, openCommand, executeTelnet };

export default {
    executeAsync,
    execCLI,
    openCommand,
    executeTelnet,
    commandExistsSync,
};
