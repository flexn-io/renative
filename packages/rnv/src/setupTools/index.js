import LinuxPlatformSetup from './linux';

export default (c) => {
    const { process: { platform }, paths: { globalConfigPath } } = c;
    if (platform === 'linux') return new LinuxPlatformSetup(globalConfigPath);
    // @todo add support for more
    return false;
};
