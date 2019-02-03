import chalk from 'chalk';
import path from 'path';
import { isPlatformSupported, getConfig, logTask, logComplete, logError } from './common';
import { cleanFolder } from './filesystem';

const create = (configName, program, process) => {
    getConfig(configName).then((v) => {
        _runCreateApp(v)
            .then(() => logComplete())
            .catch(e => logError(e));
    });
};

const _runCreateApp = c => new Promise((resolve, reject) => {
    logTask('runCreateApp');
    console.log('CONFIGIS:', c);


    // c.platformBuildsFolder
    const cleanTasks = [];
    for (const k in c.appConfigFile.platforms) {
        if (isPlatformSupported(k)) {
            const pPath = path.join(c.platformBuildsFolder, `${c.appId}_${k}`);
            console.log('BAMNBOOO', pPath);
            cleanTasks.push(cleanFolder(pPath));
        }
    }


    Promise.all(cleanTasks).then((values) => {
        console.log('GJHAGJAHGAJHGJ', values);
        resolve();
    });
});

export { create };
