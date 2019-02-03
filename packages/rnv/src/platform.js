import chalk from 'chalk';
import { isPlatformSupported, getConfig, logComplete, logError } from './common';


const addPlatform = (platform, program, process) => {
    if (!isPlatformSupported(platform)) return;
    console.log('ADD_PLATFORM: ', platform);
    getConfig().then((v) => {
        runAddPlatform()
            .then(() => logComplete())
            .catch(e => logError(e));
    });
};

const removePlatform = (platform, program, process) => {
    if (!isPlatformSupported(platform)) return;
    console.log('REMOVE_PLATFORM: ', platform);
};

const runAddPlatform = c => new Promise((resolve, reject) => {
    resolve();
});

export { addPlatform, removePlatform };
