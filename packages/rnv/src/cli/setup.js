import {
    IOS, TVOS, ANDROID, WEB, isPlatformSupported, getConfig, logTask, logComplete,
    logError, getAppFolder, logDebug, logErrorPlatform,
} from '../common';

const run = c => new Promise((resolve, reject) => {
    logTask('setup');

    resolve();
});


export default run;
