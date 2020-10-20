/* eslint-disable no-control-regex */
/* eslint-disable no-bitwise */
/* eslint-disable no-await-in-loop */

import path from 'path';
import { access, accessSync, constants } from 'fs';
import execa from 'execa';
import ora from 'ora';
import NClient from 'netcat/client';
import Config from '../configManager/config';

import { chalk, logDebug, logRaw, logError } from './logger';
import { fsExistsSync } from './fileutils';
import { replaceOverridesInString } from '../utils';

const { exec, execSync } = require('child_process');

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
const _execute = (c, command, opts = {}) => {
    const defaultOpts = {
        stdio: 'pipe',
        localDir: path.resolve('./node_modules/.bin'),
        preferLocal: true,
        all: true,
        maxErrorLength: c.program?.maxErrorLength,
        mono: c.program?.mono,
    };

    if (opts.interactive) {
        defaultOpts.silent = true;
        defaultOpts.stdio = 'inherit';
        defaultOpts.shell = true;
    }

    const mergedOpts = { ...defaultOpts, ...opts };

    let cleanCommand = command;
    let interval;
    const intervalTimer = 30000; // 30s
    let timer = intervalTimer;
    const privateMask = '*******';
    const cleanRawCmd = opts.rawCommand?.args || [];
    if (Array.isArray(command)) cleanCommand = command.join(' ');

    cleanCommand += cleanRawCmd.join(' ');
    let logMessage = cleanCommand;
    const { privateParams } = mergedOpts;
    if (privateParams && Array.isArray(privateParams)) {
        logMessage = replaceOverridesInString(
            command,
            privateParams,
            privateMask
        );
    }

    logDebug(`_execute: ${logMessage}`);
    const { silent, mono, maxErrorLength, ignoreErrors } = mergedOpts;
    const spinner = !silent && !mono && ora({ text: `Executing: ${logMessage}` }).start();
    if (opts.interactive) {
        logRaw(`${chalk().green('✔')} Executing: ${logMessage}\n`);
    }

    if (mono) {
        interval = setInterval(() => {
            logRaw(`Executing: ${logMessage} - ${timer / 1000}s`);
            timer += intervalTimer;
        }, intervalTimer);
    }
    let child;
    if (opts.rawCommand) {
        const { args } = opts.rawCommand;
        child = execa(command, args, mergedOpts);
    } else {
        child = execa.command(cleanCommand, mergedOpts);
    }

    const MAX_OUTPUT_LENGTH = 200;

    const printLastLine = (buffer) => {
        const text = Buffer.from(buffer)
            .toString()
            .trim();
        const lastLine = text.split('\n').pop();
        spinner.text = replaceOverridesInString(
            lastLine.substring(0, MAX_OUTPUT_LENGTH),
            privateParams,
            privateMask
        );
        if (lastLine.length === MAX_OUTPUT_LENGTH) spinner.text += '...\n';
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

            !silent && !mono && spinner.succeed(`Executing: ${logMessage}`);
            logDebug(
                replaceOverridesInString(res.all, privateParams, privateMask)
            );
            interval && clearInterval(interval);
            // logDebug(res);
            return res.stdout;
        })
        .catch((err) => {
            if (child?.stdout?.off) {
                spinner && child.stdout.off('data', printLastLine);
            }

            if (!silent && !mono && !ignoreErrors) { spinner.fail(`FAILED: ${logMessage}`); } // parseErrorMessage will return false if nothing is found, default to previous implementation
            logDebug(
                replaceOverridesInString(err.all, privateParams, privateMask)
            );
            interval && clearInterval(interval);
            // logDebug(err);
            if (ignoreErrors && !silent && !mono) {
                spinner.succeed(`Executing: ${logMessage}`);
                return true;
            }

            let errMessage = parseErrorMessage(err.all, maxErrorLength);

            if (!errMessage) {
                errMessage = '';
            } else {
                errMessage += '\n\n';
            }

            if (err.message) {
                errMessage += `${err.message}\n\n`;
            }

            if (err.stderr) {
                errMessage += `${err.stderr}\n\n`;
            }

            if (err.stack) {
                errMessage += `${err.stack}\n\n`;
            }

            errMessage = replaceOverridesInString(
                errMessage,
                privateParams,
                privateMask
            );

            return Promise.reject(
                `COMMAND: \n\n${logMessage} \n\nFAILED with ERROR: \n\n${errMessage}`
            ); // parseErrorMessage will return false if nothing is found, default to previous implementation
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
const execCLI = (c, cli, command, opts = {}) => {
    if (!c.program) {
        return Promise.reject(
            'You need to pass c object as first parameter to execCLI()'
        );
    }
    const p = c.cli[cli];
    if (!fsExistsSync(p)) {
        logDebug(`execCLI error: ${cli} | ${command}`, '\nCLI Config:\n', c.cli, '\nSDK Config:\n', c.buildConfig?.sdks);
        return Promise.reject(
            `Location of your cli ${chalk().white(
                p
            )} does not exists. check your ${chalk().white(
                c.paths.workspace.config
            )} file if your ${chalk().white('sdks')} paths are correct`
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
const executeAsync = async (_c, _cmd, _opts) => {
    // swap values if c is not specified and get it from it's rightful place, config :)
    let c = _c;
    let cmd = _cmd;
    let opts = _opts;
    if (typeof c === 'string') {
        opts = cmd;
        cmd = c;
        c = Config.getConfig();
    }
    opts = opts || {};
    if (cmd.includes('npm') && process.platform === 'win32') { cmd.replace('npm', 'npm.cmd'); }
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
    const result = await _execute(c, cmd, opts);

    return result;
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
const executeTelnet = (c, port, command) => new Promise((resolve) => {
    logDebug(`execTelnet: ${port} ${command}`);
    try {
        let output = '';
        const nc2 = new NClient();
        nc2.addr(c.runtime.localhost)
            .port(parseInt(port, 10))
            .connect()
            .send(`${command}\n`);
        nc2.on('data', (data) => {
            const resp = Buffer.from(data).toString();
            output += resp;
            if (output.includes('OK')) nc2.close();
        });
        nc2.on('close', () => resolve(output));
    } catch (e) {
        logError(e);
        resolve();
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


export const parseErrorMessage = (text, maxErrorLength = 800) => {
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
            v.includes('-Werror')
            || v.includes('following modules are linked manually')
            || v.includes('warn ')
            || v.includes('note: ')
            || v.includes('warning: ')
            || v.includes('Could not find the following native modules')
            || v.includes('⚠️')
            || v.includes('/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain')
        ) {
            return false;
        }
        // Cleaner Android reporting
        if (
            v.includes('[DEBUG]')
            || v.includes('[INFO]')
            || v.includes('[LIFECYCLE]')
            || v.includes('[WARN]')
            || v.includes(':+HeapDumpOnOutOfMemoryError')
            || v.includes('.errors.')
            || v.includes('-exception-')
            || v.includes('error_prone_annotations')
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

const fileNotExists = (commandName, callback) => {
    access(commandName, constants.F_OK, (err) => {
        callback(!err);
    });
};

const fileNotExistsSync = (commandName) => {
    try {
        accessSync(commandName, constants.F_OK);
        return false;
    } catch (e) {
        return true;
    }
};

const localExecutable = (commandName, callback) => {
    access(commandName, constants.F_OK | constants.X_OK, (err) => {
        callback(null, !err);
    });
};

const localExecutableSync = (commandName) => {
    try {
        accessSync(commandName, constants.F_OK | constants.X_OK);
        return true;
    } catch (e) {
        return false;
    }
};

const commandExistsUnix = (commandName, cleanedCommandName, callback) => {
    fileNotExists(commandName, (isFile) => {
        if (!isFile) {
            exec(
                `command -v ${cleanedCommandName} 2>/dev/null`
                    + ` && { echo >&1 ${cleanedCommandName}; exit 0; }`,
                (error, stdout) => {
                    callback(null, !!stdout);
                }
            );
            return;
        }

        localExecutable(commandName, callback);
    });
};

const commandExistsWindows = (commandName, cleanedCommandName, callback) => {
    if (/[\x00-\x1f<>:"|?*]/.test(commandName)) {
        callback(null, false);
        return;
    }
    exec(`where ${cleanedCommandName}`, (error) => {
        if (error !== null) {
            callback(null, false);
        } else {
            callback(null, true);
        }
    });
};

const commandExistsUnixSync = (commandName, cleanedCommandName) => {
    if (fileNotExistsSync(commandName)) {
        try {
            const stdout = execSync(
                `command -v ${cleanedCommandName} 2>/dev/null`
                    + ` && { echo >&1 ${cleanedCommandName}; exit 0; }`
            );
            return !!stdout;
        } catch (error) {
            return false;
        }
    }
    return localExecutableSync(commandName);
};

const commandExistsWindowsSync = (commandName, cleanedCommandName) => {
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

let cleanInput = (_s) => {
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

const commandExists = (commandName, callback) => {
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

const commandExistsSync = (commandName) => {
    const cleanedCommandName = cleanInput(commandName);
    if (isUsingWindows) {
        return commandExistsWindowsSync(commandName, cleanedCommandName);
    }
    return commandExistsUnixSync(commandName, cleanedCommandName);
};


// eslint-disable-next-line no-nested-ternary
const openCommand = process.platform === 'darwin'
    ? 'open'
    : process.platform === 'win32'
        ? 'start'
        : 'xdg-open';

export {
    executeAsync,
    execCLI,
    commandExists,
    commandExistsSync,
    openCommand,
    executeTelnet
};

export default {
    executeAsync,
    execCLI,
    openCommand,
    executeTelnet
};
