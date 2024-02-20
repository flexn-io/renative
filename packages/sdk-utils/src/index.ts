import { getBuildsFolder } from '@rnv/core';
import { fsExistsSync } from '@rnv/core';
import { getAppTemplateFolder } from '@rnv/core';
import { DEFAULTS, RnvContext, RnvPlatform, getConfigProp, logTask } from '@rnv/core';
import axios from 'axios';
import open from 'better-opn';
import detectPort from 'detect-port';
import path from 'path';

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

export const getDevServerHost = (c: RnvContext) => {
    const devServerHostOrig = getConfigProp(c, c.platform, 'devServerHost');

    const devServerHostFixed = devServerHostOrig
        ? getValidLocalhost(devServerHostOrig, c.runtime.localhost || DEFAULTS.devServerHost)
        : DEFAULTS.devServerHost;

    return devServerHostFixed;
};

export const waitForHost = async (c: RnvContext, suffix = 'assets/bundle.js') => {
    logTask('waitForHost', `port:${c.runtime.port}`);
    let attempts = 0;
    const maxAttempts = 10;
    const CHECK_INTEVAL = 2000;
    // const spinner = ora('Waiting for webpack to finish...').start();

    const devServerHost = getDevServerHost(c);
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

export const checkPortInUse = (c: RnvContext, platform: RnvPlatform, port: number) =>
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

export const getBuildFilePath = (
    c: RnvContext,
    platform: RnvPlatform,
    filePath: string,
    altTemplateFolder?: string
) => {
    // P1 => platformTemplates
    let sp = path.join(altTemplateFolder || getAppTemplateFolder(c, platform)!, filePath);
    // P2 => appConfigs/base + @buildSchemes
    const sp2bf = getBuildsFolder(c, platform, c.paths.project.appConfigBase.dir);
    if (sp2bf) {
        const sp2 = path.join(sp2bf, filePath);
        if (fsExistsSync(sp2)) sp = sp2;
    }

    // P3 => appConfigs + @buildSchemes
    const sp3bf = getBuildsFolder(c, platform);

    if (sp3bf) {
        const sp3 = path.join(sp3bf, filePath);
        if (fsExistsSync(sp3)) sp = sp3;
    }

    return sp;
};
