import LinuxPlatformSetup from './linux';
import WindowsPlatformSetup from './windows';
import DarwinPlatformSetup from './darwin';
import Config from '../configManager/config';

export default (_c) => {
    let c = _c;
    if (!c) c = Config.getConfig();
    const {
        process: { platform }
    } = c;
    if (platform === 'linux') return new LinuxPlatformSetup(c);
    if (platform === 'win32') return new WindowsPlatformSetup(c);
    if (platform === 'darwin') return new DarwinPlatformSetup();
    // @todo add support for more

    throw new Error('Platform unsupported for automated SDK setup');
};
