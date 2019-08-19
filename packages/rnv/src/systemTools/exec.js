/* eslint-disable import/no-cycle */
import path from 'path';
import shell from 'shelljs';
import fs, { access, accessSync, constants } from 'fs';
import chalk from 'chalk';
import execa from 'execa';
import ora from 'ora';
import NClient from 'netcat/client';

import { logDebug } from '../common';
import { isInfoEnabled } from './logger';

const { exec, execSync } = require('child_process');

const SEPARATOR = process.platform === 'win32' ? ';' : ':';
const env = Object.assign({}, process.env);
env.PATH = path.resolve('./node_modules/.bin') + SEPARATOR + env.PATH;

// const execCLI2 = (c, cli, command, log = console.log) => new Promise((resolve, reject) => {
//     log(`execCLI:${cli}:${command}`);

//     let toBeExecuted;

//     if (c && cli) {
//         const p = c.cli[cli];

//         if (!fs.existsSync(p)) {
//             reject(
//                 `Location of your cli ${chalk.white(p)} does not exists. check your ${chalk.white(
//                     c.paths.globalConfigPath
//                 )} file if you SDK path is correct`
//             );
//             return;
//         }
//         toBeExecuted = `${p} ${command}`;
//     } else {
//         toBeExecuted = command;
//     }

//     logDebug('ExecCLI:', toBeExecuted);

//     shell.exec(toBeExecuted, { silent: true, env: process.env, stdio: [process.stdin, 'pipe', 'pipe'] }, (error, stdout) => {
//         if (error) {
//             reject(`Command ${cli} failed: "${chalk.white(`${toBeExecuted}`)}". ${stdout.trim()}`);
//             return;
//         }

//         resolve(stdout.trim());
//     });
// });

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

    const spinner = ora(`Executing: ${cleanCommand}`).start();
    return execa.command(cleanCommand, mergedOpts).then((res) => {
        spinner.succeed();
        logDebug(res.all);
        return res;
    }).catch((err) => {
        spinner.fail(err.stdout || err.stderr || err.message);
        logDebug(err.all);
        return Promise.reject(err.stdout || err.stderr || err.message);
    });
};

const execCLI = (c, cli, command) => {
    const p = c.cli[cli];

    if (!fs.existsSync(p)) {
        return Promise.reject(`Location of your cli ${chalk.white(p)} does not exists. check your ${chalk.white(
            c.paths.globalConfigPath
        )} file if you SDK path is correct`);
    }

    return _execute(`${p} ${command}`, { shell: true });
};

const executeAsync = (cmd, args, opts) => {
    if (cmd.includes('npm') && process.platform === 'win32') cmd.replace('npm', 'npm.cmd');
    return _execute(cmd, opts);
};

const executeTelnet = (port, command) => new Promise((resolve) => {
    const nc2 = new NClient();
    logDebug(`execTelnet: ${port} ${command}`);

    nc2.addr('127.0.0.1')
        .port(parseInt(port, 10))
        .connect()
        .send(`${command}\n`);
    nc2.on('data', (data) => {
        const buffer = Buffer.from(data);
        return resolve(buffer.toString());
    });
});

// const executeAsync2 = (
//     cmd,
//     args,
//     opts = {}
// ) => new Promise((resolve, reject) => {
//     if (cmd === 'npm' && process.platform === 'win32') cmd = 'npm.cmd';

//     const defaultOpts = {
//         // cwd: process.cwd(),
//         privateParams: [],
//         stdio: 'pipe',
//         env,
//         shell: true,
//     };

//     const mergedOpts = { ...defaultOpts, ...opts };

//     let timeout;
//     let cleanArgs = '';
//     let hideNext = false;
//     const pp = mergedOpts?.privateParams || [];
//     if (args) {
//         args.forEach((v) => {
//             if (hideNext) {
//                 hideNext = false;
//                 cleanArgs += ' ***********';
//             } else {
//                 cleanArgs += ` ${v}`;
//             }
//             if (pp.includes(v)) {
//                 hideNext = true;
//             }
//         });
//     }

//     logDebug(`executeAsync:${cmd} ${cleanArgs}`);

//     const command = spawn(cmd, args, mergedOpts);

//     let stdout = '';
//     let stdoutErr = '';
//     let ended = false;
//     const findError = new RegExp(/error |fatal |invalid /i);

//     /* eslint-disable-next-line no-unused-expressions */
//     command.stdout
//             && command.stdout.on('data', (output) => {
//                 const outputStr = output.toString();
//                 if (outputStr) {
//                     stdout += outputStr;

//                     if (findError.test(outputStr)) {
//                         stdoutErr += outputStr;
//                     }
//                 }
//             });

//     /* eslint-disable-next-line no-unused-expressions */
//     command.stderr
//             && command.stderr.on('data', (output) => {
//                 const outputStr = output.toString();
//                 if (outputStr) stdoutErr += outputStr;
//             });

//     command.on('close', (code) => {
//         if (timeout) clearTimeout(timeout);
//         logDebug(`Command ${cmd} ${cleanArgs} exited with code ${code}`);
//         if (code !== 0) {
//             reject(new Error(`process exited with code ${code}. <ERROR> ${stdoutErr} </ERROR>`));
//         } else {
//             ended = true;

//             logDebug('Execute Command:', stdout);
//             resolve(stdout);
//         }
//     });

//     command.on('error', (error) => {
//         if (timeout) clearTimeout(timeout);
//         logDebug(`Command ${cmd} ${cleanArgs} errored with ${error}`);
//         reject(new Error(`process errored with ${error}`));
//     });

//     const killChildProcess = () => {
//         if (timeout) clearTimeout(timeout);
//         if (ended) return;
//         logDebug(`Killing child process ${cmd} ${cleanArgs}`);
//         command.kill(1);
//     };

//     if (opts.timeout) {
//         timeout = setTimeout(killChildProcess, opts.timeout);
//     }

//     process.on('exit', killChildProcess);
//     process.on('SIGINT', killChildProcess);
// });

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
