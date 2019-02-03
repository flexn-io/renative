/* eslint-disable global-require */
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const removeDirAsyncWithNode = (removedPath, callback) => {
    fs.readdir(removedPath, (readError, files) => {
        if (readError) {
            // Pass the error on to callback
            callback(readError, []);
            return;
        }
        const wait = files.length;
        let count = 0;
        const folderDone = (error) => {
            count++;
            // If we cleaned out all the files, continue
            if (count >= wait || error) {
                fs.rmdir(removedPath, callback);
            }
        };
        // Empty directory to bail early
        if (!wait) {
            folderDone();
            return;
        }

        // Remove one or more trailing slash to keep from doubling up
        const cleanPath = removedPath.replace(/\/+$/, '');
        files.forEach((file) => {
            const curPath = `${cleanPath}/${file}`;
            fs.lstat(curPath, (lstatError, stats) => {
                if (lstatError) {
                    callback(lstatError, []);
                    return;
                }
                if (stats.isDirectory()) {
                    removeDirAsyncWithNode(curPath, folderDone);
                } else {
                    fs.unlink(curPath, folderDone);
                }
            });
        });
    });
};

const removeDirAsyncWithRimraf = (...args) => new Promise((resolve, reject) => {
    const rimraf = require('rimraf');
    rimraf(...args, (error) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });
});

const copyDirContents = (source, destination) => new Promise((resolve, reject) => {
    const ncp = require('ncp');
    ncp.limit = 16;

    ncp(source, destination, function (err) {
     if (err) {
        reject(err);
      } else {
        resolve()
      }
    });
});

const { spawn } = require('child_process');

const SEPARATOR = process.platform === 'win32' ? ';' : ':';
const env = Object.assign({}, process.env);
env.PATH = path.resolve('./node_modules/.bin') + SEPARATOR + env.PATH;

function executeAsync(
    cmd,
    args,
    opts = {
        cwd: process.cwd(),
        stdio: 'inherit',
        env,
    }
) {
    return new Promise((resolve, reject) => {
        const command = spawn(cmd, args, opts);

        let stdout = '';
        let ended = false;

        /* eslint-disable-next-line no-unused-expressions */
        command.stdout && command.stdout.on('data', (output) => {
            const outputStr = output.toString();
            // console.log('data', output);
            if (outputStr) stdout += outputStr;
        });

        command.on('close', (code) => {
            console.log(`Command ${cmd}${args ? ` ${args.join(' ')}` : ''} exited with code ${code}`);
            if (code !== 0) {
                reject(new Error(`process exited with code ${code}`));
            } else {
                ended = true;
                resolve(stdout);
            }
        });
        command.on('error', (error) => {
            console.log(`Command ${cmd}${args ? ` ${args.join(' ')}` : ''} errored with ${error}`);
            reject(new Error(`process errored with ${error}`));
        });

        const killChildProcess = () => {
            if (ended) return;
            console.log(`Killing child process ${cmd}${args ? ` ${args.join(' ')}` : ''}`);
            command.kill(1);
        };

        process.on('exit', killChildProcess);
        process.on('SIGINT', killChildProcess);
    });
}

module.exports = {
    removeDirAsyncWithNode,
    removeDirAsyncWithRimraf,
    executeAsync,
    copyDirContents
};
