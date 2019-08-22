/* eslint-disable import/no-cycle */
import path from 'path';
import shell from 'shelljs';
import fs, { access, accessSync, constants } from 'fs';
import chalk from 'chalk';
import execa from 'execa';
import ora from 'ora';
import NClient from 'netcat/client';
import util from 'util';

import { logDebug } from '../common';

const { exec, execSync } = require('child_process');

const SEPARATOR = process.platform === 'win32' ? ';' : ':';
const env = Object.assign({}, process.env);
env.PATH = path.resolve('./node_modules/.bin') + SEPARATOR + env.PATH;

const _execute = (command, opts = {}) => {
    const defaultOpts = {
        stdio: 'pipe',
        localDir: path.resolve('./node_modules/.bin'),
        preferLocal: true,
        all: true
    };
    const mergedOpts = { ...defaultOpts, ...opts };
    let cleanCommand = command;

    if (Array.isArray(command)) cleanCommand = command.join(' ');

    let logMessage = cleanCommand;
    if (mergedOpts.privateParams) {
        logMessage = util.format(command, ['*******']);
        cleanCommand = util.format(command, ...mergedOpts.privateParams);
    }

    logDebug(`_execute: ${logMessage}`);
    const spinner = !mergedOpts.silent && ora(`Executing: ${logMessage}`).start();
    return execa.command(cleanCommand, mergedOpts).then((res) => {
        !mergedOpts.silent && spinner.succeed();
        logDebug(res.all);
        // logDebug(res);
        return res.stdout;
    }).catch((err) => {
        const { silent, ignoreErrors } = mergedOpts;
        if (!silent && !ignoreErrors) spinner.fail(err.stderr || err.message);
        logDebug(err.all);
        // logDebug(err);
        if (ignoreErrors) {
            spinner.succeed();
            return true;
        }
        return Promise.reject(err.stderr || err.message);
    });
};

const execCLI = (c, cli, command, opts = {}) => {
    const p = c.cli[cli];

    if (!fs.existsSync(p)) {
        logDebug('execCLI error', cli, command);
        return Promise.reject(`Location of your cli ${chalk.white(p)} does not exists. check your ${chalk.white(
            c.paths.globalConfigPath
        )} file if you SDK path is correct`);
    }

    return _execute(`${p} ${command}`, { ...opts, shell: true });
};

const executeAsync = (cmd, opts) => {
    if (cmd.includes('npm') && process.platform === 'win32') cmd.replace('npm', 'npm.cmd');
    return _execute(cmd, opts);
};

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

function execShellAsync(command) {
    logDebug('Exec:', command);
    return new Promise((resolve) => {
        shell.exec(command, resolve);
    });
}

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

export { executeAsync, execShellAsync, execCLI, commandExists, commandExistsSync, openCommand, executeTelnet };

export default {
    executeAsync,
    execShellAsync,
    execCLI,
    openCommand,
    executeTelnet
};
