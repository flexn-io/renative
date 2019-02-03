import chalk from 'chalk';

const SUPPORTED_PLATFORMS = ['all', 'ios', 'android', 'web', 'tizen'];
const RNV = 'RNV';
const LINE = '-----------------------------';

let _currentJob;
let _currentProcess;

const isPlatformSupported = (platform) => {
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        console.warn(chalk.yellow(`Warning: Platform ${platform} is not supported`));
        return false;
    }
    return true;
};

const setCurrentJob = (cmd, process) => {
    _currentJob = cmd;
    _currentProcess = process;
};

const logTask = (task) => {
    console.log(chalk.yellow(`\n${RNV} ${_currentJob} - ${task} - Starting!`));
};

const logStart = () => {
    console.log(chalk.white.bold(`\n${LINE}\n RNV is Firing Up!!! 🔥\n${LINE}\n`));
};

const logComplete = () => {
    console.log(chalk.white.bold(`\n ${RNV} ${_currentJob} - Done! 🍺 \n${LINE}\n`));
};

const logError = (e, process) => {
    console.log(chalk.red.bold(`\n${RNV} ${_currentJob} - ERRROR! ${e} \n${LINE}\n`));
    _currentProcess.exit();
};

const getConfig = config => new Promise((resolve, reject) => {
    logTask('getConfig');

    resolve({
        foo: 'bar',
    });
});

export {
    SUPPORTED_PLATFORMS, isPlatformSupported, setCurrentJob,
    logTask, logComplete, logError, getConfig, logStart,
};
