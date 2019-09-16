import { createRnvConfig, generateBuildConfig } from '../../src/configTools/configParser';
import { getAppVersionCode } from '../../src/common';

let c;

describe('Bootstrapping the CLI', () => {
    beforeAll(() => {
        c = createRnvConfig({ program: true }, { process: true }, { cmd: true }, { subCmd: true });
        generateBuildConfig(c);
    });

    it('should create C variable correctly', async () => {
        const cKeys = Object.keys(c).sort();
        const expectKeys = ['buildConfig', 'cli', 'command', 'files', 'paths', 'platform', 'platformDefaults', 'process', 'program', 'runtime', 'subCommand'];
        expect(cKeys).toEqual(expectKeys);
    });

    it('should return app version', () => {
        expect(() => getAppVersionCode(c, 'android')).toThrow();
    });
});
