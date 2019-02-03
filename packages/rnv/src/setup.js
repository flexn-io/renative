import chalk from 'chalk';
import { isPlatformSupported, getConfig, logTask, logComplete, logError } from './common';


const create = (configName, program, process) => {
    getConfig().then((v) => {
        _runCreateApp()
            .then(() => logComplete())
            .catch(e => logError(e));
    });
};

const _runCreateApp = c => new Promise((resolve, reject) => {
    logTask('runCreateApp');
    resolve();
});

export { create };
