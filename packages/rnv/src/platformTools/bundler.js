import axios from 'axios';
import ora from 'ora';

import Config from '../config';

export const isBundlerRunning = async (c) => {
    try {
        const { data } = await axios.get(`http://127.0.0.1:${c.runtime.port}`);
        if (data.includes('React Native')) return true;
        return false;
    } catch {
        return false;
    }
};

export const waitForBundler = async (c) => {
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 1000;
    const spinner = ora('Waiting for bundler to finish...').start();

    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            isBundlerRunning(c)
                .then((running) => {
                    if (running) {
                        clearInterval(interval);
                        spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        spinner.fail('Can\'t connect to bundler. Try restarting it.');
                        return reject('Can\'t connect to bundler. Try restarting it.');
                    }
                }).catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        spinner.fail('Can\'t connect to bundler. Try restarting it.');
                        return reject('Can\'t connect to bundler. Try restarting it.');
                    }
                });
        }, CHECK_INTEVAL);
    });
};
