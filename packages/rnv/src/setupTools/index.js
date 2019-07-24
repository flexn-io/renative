import LinuxPlatformSetup from './linux';
import WindowsPlatformSetup from './windows';

export default (c, isCI) => {
    const { process: { platform }, paths: { globalConfigPath } } = c;
    if (platform === 'linux') return new LinuxPlatformSetup(globalConfigPath, isCI);
    if (platform === 'win32') return new WindowsPlatformSetup(globalConfigPath, isCI);
    // @todo add support for more

    throw new Error('Platform unsupported')
};
