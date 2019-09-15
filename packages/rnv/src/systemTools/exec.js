/* eslint-disable import/no-cycle */
import path from 'path';
import fs, { access, accessSync, constants } from 'fs';
import chalk from 'chalk';
import execa from 'execa';
import ora from 'ora';
import NClient from 'netcat/client';
import util from 'util';

import { logDebug } from './logger';

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

    if (Array.isArray(command)) cleanCommand = command.join(' ');

    let logMessage = cleanCommand;
    const { privateParams } = mergedOpts;
    if (privateParams && Array.isArray(privateParams)) {
        logMessage = util.format(command, Array.from(privateParams, () => '*******'));
        cleanCommand = util.format(command, ...privateParams);
    }

    logDebug(`_execute: ${logMessage}`);
    const { silent, mono, maxErrorLength, ignoreErrors } = mergedOpts;
    const spinner = !silent && !mono && ora({ text: `Executing: ${logMessage}` }).start();

    if (mono) {
        interval = setInterval(() => {
            console.log(`Executing: ${logMessage} - ${timer / 1000}s`);
            timer += intervalTimer;
        }, intervalTimer);
    }

    const child = execa.command(cleanCommand, mergedOpts);

    const MAX_OUTPUT_LENGTH = 200;

    const printLastLine = (buffer) => {
        const text = Buffer.from(buffer).toString().trim();
        const lastLine = text.split('\n').pop();
        spinner.text = lastLine.substring(0, MAX_OUTPUT_LENGTH);
        if (lastLine.length === MAX_OUTPUT_LENGTH) spinner.text += '...\n';
    };

    if (c.program?.info) {
        child.stdout.pipe(process.stdout);
    } else if (spinner) {
        child.stdout.on('data', printLastLine);
    }

    return child.then((res) => {
        spinner && child.stdout.off('data', printLastLine);
        !silent && !mono && spinner.succeed(`Executing: ${logMessage}`);
        logDebug(res.all);
        interval && clearInterval(interval);
        // logDebug(res);
        return res.stdout;
    }).catch((err) => {
        spinner && child.stdout.off('data', printLastLine);
        if (!silent && !mono && !ignoreErrors) spinner.fail(`FAILED: ${logMessage}`); // parseErrorMessage will return false if nothing is found, default to previous implementation
        logDebug(err.all);
        interval && clearInterval(interval);
        // logDebug(err);
        if (ignoreErrors && !silent && !mono) {
            spinner.succeed(`Executing: ${logMessage}`);
            return true;
        }
        const errMessage = parseErrorMessage(err.all, maxErrorLength) || err.stderr || err.message;
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
const execCLI = (c, cli, command, opts = {}) => {
    const p = c.cli[cli];

    if (!fs.existsSync(p)) {
        logDebug('execCLI error', cli, command);
        return Promise.reject(`Location of your cli ${chalk.white(p)} does not exists. check your ${chalk.white(
            c.paths.globalConfigPath
        )} file if you SDK path is correct`);
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
const executeAsync = (c, cmd, opts) => {
    if (cmd.includes('npm') && process.platform === 'win32') cmd.replace('npm', 'npm.cmd');
    return _execute(c, cmd, opts);
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
const executeTelnet = (port, command) => new Promise((resolve) => {
    const nc2 = new NClient();
    logDebug(`execTelnet: ${port} ${command}`);

    let output = '';

    nc2.addr('127.0.0.1')
        .port(parseInt(port, 10))
        .connect()
        .send(`${command}\n`);
    nc2.on('data', (data) => {
        const resp = Buffer.from(data).toString();
        output += resp;
        if (output.includes('OK')) nc2.close();
    });
    nc2.on('close', () => resolve(output));
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
    const errors = [];
    const toSearch = /(exception|error|fatal|\[!])/i;

    let arr = text.split('\n');
    const finalText = '';
    arr = arr.filter((v) => {
        const result = v.search(toSearch);
        return result !== -1;
    });
    arr = arr.map((v) => {
        let extractedError = v.substring(0, maxErrorLength);
        if (extractedError.length === maxErrorLength) extractedError += '...';
        return extractedError;
    });
    return arr.join('\n');
};

const isUsingWindows = process.platform === 'win32';

const fileNotExists = (commandName, callback) => {
    access(commandName, constants.F_OK,
        (err) => {
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
    access(commandName, constants.F_OK | constants.X_OK,
        (err) => {
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
            exec(`command -v ${cleanedCommandName
            } 2>/dev/null`
                  + ` && { echo >&1 ${cleanedCommandName}; exit 0; }`,
            (error, stdout) => {
                callback(null, !!stdout);
            });
            return;
        }

        localExecutable(commandName, callback);
    });
};

const commandExistsWindows = (commandName, cleanedCommandName, callback) => {
    if (/[\x00-\x1f<>:"\|\?\*]/.test(commandName)) {
        callback(null, false);
        return;
    }
    exec(`where ${cleanedCommandName}`,
        (error) => {
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
            const stdout = execSync(`command -v ${cleanedCommandName
            } 2>/dev/null`
              + ` && { echo >&1 ${cleanedCommandName}; exit 0; }`);
            return !!stdout;
        } catch (error) {
            return false;
        }
    }
    return localExecutableSync(commandName);
};

const commandExistsWindowsSync = (commandName, cleanedCommandName) => {
    if (/[\x00-\x1f<>:"\|\?\*]/.test(commandName)) {
        return false;
    }
    try {
        const stdout = execSync(`where ${cleanedCommandName}`, { stdio: [] });
        return !!stdout;
    } catch (error) {
        return false;
    }
};

let cleanInput = (s) => {
    if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
        s = `'${s.replace(/'/g, "'\\''")}'`;
        s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
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
        return new Promise(((resolve, reject) => {
            commandExists(commandName, (error, output) => {
                if (output) {
                    resolve(commandName);
                } else {
                    reject(error);
                }
            });
        }));
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

const openCommand = process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open';

export { executeAsync, execCLI, commandExists, commandExistsSync, openCommand, executeTelnet };

export default {
    executeAsync,
    execCLI,
    openCommand,
    executeTelnet
};
