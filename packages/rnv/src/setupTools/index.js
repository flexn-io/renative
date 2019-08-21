import LinuxPlatformSetup from './linux';
import WindowsPlatformSetup from './windows';

export default (c) => {
    const { process: { platform } } = c;
    if (platform === 'linux') return new LinuxPlatformSetup(c);
    if (platform === 'win32') return new WindowsPlatformSetup(c);
    // @todo add support for more

    throw new Error('Platform unsupported for automated SDK setup');
};
