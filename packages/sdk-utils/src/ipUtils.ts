import { DEFAULTS, chalk, getConfigProp, getContext, inquirerPrompt, isSystemWin, logDefault } from '@rnv/core';
import axios from 'axios';
import open from 'better-opn';
import detectPort from 'detect-port';
import killPort from 'kill-port';
import os from 'os';

export const confirmActiveBundler = async () => {
    const c = getContext();
    if (c.runtime.skipActiveServerCheck) return true;

    if (c.program.opts().ci) {
        //TODO: handle return codes properly
        await killPort(c.runtime.port);
        return true;
    }

    const choices = ['Restart the server (recommended)', 'Use existing session'];

    const { selectedOption } = await inquirerPrompt({
        name: 'selectedOption',
        type: 'list',
        choices,
        warningMessage: `Another ${c.platform} server at port ${chalk().bold.white(c.runtime.port)} already running`,
    });

    if (choices[0] === selectedOption) {
        await killPort(c.runtime.port);
    } else {
        return false;
    }
    return true;
};

export const getValidLocalhost = (value: string, localhost: string) => {
    if (!value) return localhost;
    switch (value) {
        case 'localhost':
        case '0.0.0.0':
        case '127.0.0.1':
            return localhost;
        default:
            return value;
    }
};

export const openBrowser = open;

export const getDevServerHost = () => {
    const c = getContext();
    const devServerHostOrig = getConfigProp('devServerHost');

    const devServerHostFixed = devServerHostOrig
        ? getValidLocalhost(devServerHostOrig, c.runtime.localhost || DEFAULTS.devServerHost)
        : DEFAULTS.devServerHost;

    return devServerHostFixed;
};

export const waitForHost = async (
    suffix = 'assets/bundle.js',
    opts?: { maxAttempts: number; checkInterval: number }
) => {
    const c = getContext();
    logDefault('waitForHost', `port:${c.runtime.port}`);
    let attempts = 0;
    const maxAttempts = opts?.maxAttempts || 10;
    const CHECK_INTEVAL = opts?.checkInterval || 2000;
    // const spinner = ora('Waiting for webpack to finish...').start();

    const devServerHost = getDevServerHost();
    const url = `http://${devServerHost}:${c.runtime.port}/${suffix}`;

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            axios
                .get(url)
                .then((res) => {
                    if (res.status === 200) {
                        clearInterval(interval);
                        // spinner.succeed();
                        return resolve(true);
                    }
                    attempts++;
                    if (attempts === maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject(`Can't connect to host ${url}. Try restarting it.`);
                    }
                })
                .catch(() => {
                    attempts++;
                    if (attempts > maxAttempts) {
                        clearInterval(interval);
                        // spinner.fail('Can\'t connect to webpack. Try restarting it.');
                        return reject(`Can't connect to host ${url}. Try restarting it.`);
                    }
                });
        }, CHECK_INTEVAL);
    });
};

export const checkPortInUse = (port: number) =>
    new Promise((resolve, reject) => {
        if (port === undefined || port === null) {
            resolve(false);
            return;
        }
        detectPort(port, (err: string, availablePort: string) => {
            if (err) {
                reject(err);
                return;
            }
            const result = port !== parseInt(availablePort, 10);
            resolve(result);
        });
    });

export const isUrlLocalhost = (value: string) => {
    if (value?.includes) {
        if (value.includes('localhost')) return true;
        if (value.includes('0.0.0.0')) return true;
        if (value.includes('127.0.0.1')) return true;
    }
    return false;
};

const ipFromLong = (longIp: number) =>
    `${longIp >>> 24}.${(longIp >> 16) & 255}.${(longIp >> 8) & 255}.${longIp & 255}`;

const isLoopback = (address: string) => {
    // convert ipv4 ip if it's in a long form
    if (!/\./.test(address) && !/:/.test(address)) {
        address = ipFromLong(Number(address));
    }

    return (
        /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.test(address) ||
        /^0177\./.test(address) ||
        /^0x7f\./i.test(address) ||
        /^fe80::1$/i.test(address) ||
        /^::1$/.test(address) ||
        /^::$/.test(address)
    );
};

export const getIP = () => {
    const interfaces = os.networkInterfaces();

    const all = Object.keys(interfaces)
        .map((netIntInfoKey) => {
            const addresses = interfaces?.[netIntInfoKey]?.filter((netIntInfo) => {
                if (netIntInfo.family !== 'IPv4' || isLoopback(netIntInfo.address)) {
                    return false;
                }
                return true;
            });

            return addresses?.length ? addresses[0].address : undefined;
        })
        .filter(Boolean);

    return all.length ? (isSystemWin && all.length > 1 ? all[1] : all[0]) : '127.0.0.1';
};
