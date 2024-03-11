import path from 'path';
import axios from 'axios';
import {
    logDefault,
    executeTask,
    chalk,
    getConfigProp,
    RnvContext,
    fsExistsSync,
    logWarning,
    parseFonts,
    getApi,
    RnvTaskName,
    getContext,
} from '@rnv/core';
import { confirmActiveBundler } from '@rnv/sdk-utils';

let keepRNVRunning = false;

export const startBundlerIfRequired = async (parentTask: string, originTask?: string) => {
    const c = getContext();
    logDefault('startBundlerIfRequired');
    const bundleAssets = getConfigProp('bundleAssets');
    if (bundleAssets === true) return;

    const isRunning = await isBundlerActive(c);
    if (!isRunning) {
        // _taskStart(c, parentTask, originTask);
        await executeTask(RnvTaskName.start, parentTask, originTask);

        keepRNVRunning = true;
        await waitForBundler(c);
    } else {
        const resetCompleted = await confirmActiveBundler();
        if (resetCompleted) {
            await executeTask(RnvTaskName.start, parentTask, originTask);

            keepRNVRunning = true;
            await waitForBundler(c);
        }
    }
};

export const waitForBundlerIfRequired = async () => {
    const c = getContext();
    const bundleAssets = getConfigProp('bundleAssets');
    if (bundleAssets === true) return;
    // return a new promise that does...nothing, just to keep RNV running while the bundler is running
    if (keepRNVRunning)
        return new Promise(() => {
            //Do nothing
        });
    return true;
};

const _isBundlerRunning = async (c: RnvContext) => {
    logDefault('_isBundlerRunning');
    try {
        const { data } = await axios.get(
            `http://${c.runtime.localhost}:${c.runtime.port}/${getConfigProp('entryFile')}.js`
        );
        if (data.includes('import')) {
            logDefault('_isBundlerRunning', '(YES)');
            return true;
        }
        logDefault('_isBundlerRunning', '(NO)');
        return false;
    } catch (e) {
        logDefault('_isBundlerRunning', '(NO)');
        return false;
    }
};

export const isBundlerActive = async (c: RnvContext) => {
    logDefault('isBundlerActive', `(http://${c.runtime.localhost}:${c.runtime.port})`);
    try {
        await axios.get(`http://${c.runtime.localhost}:${c.runtime.port}`);
        return true;
    } catch (e) {
        return false;
    }
};

const poll = (fn: () => Promise<boolean>, timeout = 30000, interval = 1000) => {
    const endTime = Number(new Date()) + timeout;

    const spinner = getApi().spinner('Waiting for bundler to finish...').start('');
    const checkCondition = async (resolve: () => void, reject: (e: string) => void) => {
        try {
            const result = await fn();
            if (result) {
                spinner.succeed('');
                resolve();
            } else if (Number(new Date()) < endTime) {
                setTimeout(checkCondition, interval, resolve, reject);
            } else {
                spinner.fail("Can't connect to bundler. Try restarting it.");
                reject("Can't connect to bundler. Try restarting it.");
            }
        } catch (e: unknown) {
            spinner.fail("Can't connect to bundler. Try restarting it.");
            if (typeof e === 'string') {
                reject(e);
            } else if (e instanceof Error) {
                reject(e.message);
            }
        }
    };

    return new Promise<void>(checkCondition);
};

export const configureFonts = async () => {
    const c = getContext();
    const fontFolders = new Set<string>();
    parseFonts((font, dir) => {
        if (font.includes('.ttf') || font.includes('.otf')) {
            const key = font.split('.')[0];
            const includedFonts = getConfigProp('includedFonts');
            if (includedFonts && (includedFonts.includes('*') || includedFonts.includes(key))) {
                const fontSource = path.join(dir, font);
                if (fsExistsSync(fontSource)) {
                    // extract folder name from path
                    const fontFolder = fontSource.split('/').slice(0, -1).join('/');
                    fontFolders.add(fontFolder);
                } else {
                    logWarning(`Font ${chalk().bold(fontSource)} doesn't exist! Skipping.`);
                }
            }
        }
    });

    // set it so react-native.config.js can pick it up
    c.paths.project.fontSourceDirs = Array.from(fontFolders);
};

export const waitForBundler = async (c: RnvContext) => poll(() => _isBundlerRunning(c));
