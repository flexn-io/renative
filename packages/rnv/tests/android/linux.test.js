import os from 'os';

import PlatformSetup from '../../src/setupTools';
import { listAndroidTargets } from '../../src/platformTools/android';

beforeAll(async (done) => {
    const globalConfigPath = `${os.homedir()}/.rnv/config.json`;
    const c = { process, paths: { globalConfigPath } };
    const platformSetup = PlatformSetup(c);
    await platformSetup.installAndroidSdk();
    done();
});

it('Lists no emulators', async () => {
    const devices = await listAndroidTargets();
    expect(devices).toHaveLength(0);
});
