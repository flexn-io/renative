import chalk from 'chalk';
import { isPlatformSupported, getConfig, logComplete, logError, logTask } from './common';


const addPlatform = (platform, program, process) => new Promise((resolve, reject) => {
    if (!isPlatformSupported(platform)) return;

    getConfig().then((v) => {
        _runAddPlatform()
            .then(() => resolve())
            .catch(e => reject(e));
    });
});

const removePlatform = (platform, program, process) => new Promise((resolve, reject) => {
    if (!isPlatformSupported(platform)) return;
    console.log('REMOVE_PLATFORM: ', platform);
    resolve();
});

const _runAddPlatform = c => new Promise((resolve, reject) => {
    logTask('runAddPlatform');
    resolve();
});

export { addPlatform, removePlatform };
