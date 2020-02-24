import axios from 'axios';
import ora from 'ora';
import { getConfigProp } from '../common';
import { logTask } from '../systemTools/logger';

const _isBundlerRunning = async (c) => {
    logTask(`_isBundlerRunning:${c.platform}`);
    try {
        const { data } = await axios.get(`http://${c.runtime.localhost}:${c.runtime.port}/${getConfigProp(c, c.platform, 'entryFile')}.js`);
        if (data.includes('import')) return true;
        return false;
    } catch (e) {
        return false;
    }
};

export const isBundlerActive = async (c) => {
    logTask(`isBundlerActive:${c.platform}`);
    try {
        await axios.get(`http://${c.runtime.localhost}:${c.runtime.port}`);
        return true;
    } catch (e) {
        return false;
    }
};

const poll = (fn, timeout = 10000, interval = 1000) => {
    const endTime = Number(new Date()) + timeout;

    const spinner = ora('Waiting for bundler to finish...').start();
    const checkCondition = async (resolve, reject) => {
        try {
            const result = await fn();
            if (result) {
                spinner.succeed();
                resolve();
            } else if (Number(new Date()) < endTime) {
                setTimeout(checkCondition, interval, resolve, reject);
            } else {
                spinner.fail('Can\'t connect to bundler. Try restarting it.');
                reject('Can\'t connect to bundler. Try restarting it.');
            }
        } catch (e) {
            spinner.fail('Can\'t connect to bundler. Try restarting it.');
            reject(e);
        }
    };

    return new Promise(checkCondition);
};

export const waitForBundler = async c => poll(() => _isBundlerRunning(c));
