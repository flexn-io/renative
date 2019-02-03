import chalk from 'chalk';

const SUPPORTED_PLATFORMS = ['all', 'ios', 'android', 'web', 'tizen'];

const isPlatformSupported = (platform) => {
    if (!SUPPORTED_PLATFORMS.includes(platform)) {
        console.warn(chalk.yellow(`Warning: Platform ${platform} is not supported`));
        return false;
    }
    return true;
};

export { SUPPORTED_PLATFORMS, isPlatformSupported };
