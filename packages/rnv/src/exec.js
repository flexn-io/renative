import path from 'path';

const { spawn } = require('child_process');

const SEPARATOR = process.platform === 'win32' ? ';' : ':';
const env = Object.assign({}, process.env);
env.PATH = path.resolve('./node_modules/.bin') + SEPARATOR + env.PATH;

const executeAsync = (
    cmd,
    args,
    opts = {
        cwd: process.cwd(),
        stdio: 'inherit',
        env,
    },
) => new Promise((resolve, reject) => {
    const command = spawn(cmd, args, opts);

    let stdout = '';
    let ended = false;

    /* eslint-disable-next-line no-unused-expressions */
    command.stdout && command.stdout.on('data', (output) => {
        const outputStr = output.toString();
        console.log('data', output);
        if (outputStr) stdout += outputStr;
    });

    command.on('close', (code) => {
        console.log(`Command ${cmd}${args ? ` ${args.join(' ')}` : ''} exited with code ${code}`);
        if (code !== 0) {
            reject(new Error(`process exited with code ${code}`));
        } else {
            ended = true;
            console.log('FSLSLS', command);
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

export { executeAsync };
