import LinuxPlatformSetup from './linux';

export default (c, isCI) => {
    const { process: { platform }, paths: { globalConfigPath } } = c;
    if (platform === 'linux') return new LinuxPlatformSetup(globalConfigPath, isCI);
    // @todo add support for more
    return false;
};
