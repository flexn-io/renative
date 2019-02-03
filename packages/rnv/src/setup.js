import chalk from 'chalk';
import { isPlatformSupported, getConfig, logTask, logComplete, logError } from './common';

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
    resolve();
});

export { create };
