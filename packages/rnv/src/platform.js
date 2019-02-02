import chalk from 'chalk';

const SUPPORTED_PLATFORMS = ['all', 'ios', 'android', 'web', 'tizen'];

const addPlatform = (platform, program, process) => {
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        console.warn(chalk.yellow(`Warning: Platform ${platform} is not supported`));
        return;
    }
    console.log('ADD_PLATFORM: ', cmdOption);
};

export { addPlatform };
