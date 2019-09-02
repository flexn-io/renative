import { createRnvConfig, generateBuildConfig } from '../../src/configTools/configParser';
import { getAppVersionCode } from '../../src/common';

let c;

describe('Bootstrapping the CLI', () => {
    beforeAll(() => {
        c = createRnvConfig({ program: true }, { process: true }, { cmd: true }, { subCmd: true });
        generateBuildConfig(c);
    });

    it('should create C variable correctly', async () => {
        expect(Object.keys(c).sort()).toEqual(['buildConfig', 'cli', 'command', 'files', 'paths', 'platform', 'platformDefaults', 'process', 'program', 'runtime', 'subCommand']);
    });

    it('should return app version', () => {
        expect(() => getAppVersionCode(c, 'android')).toThrow();
    });
});
