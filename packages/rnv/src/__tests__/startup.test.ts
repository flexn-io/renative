import { createRnvConfig, generateBuildConfig } from '../../src/core/configManager';
import { getAppVersionCode } from '../../src/core/common';

jest.mock('../../src/core/systemManager/logger.ts');

let c;

describe('Bootstrapping the CLI', () => {
    beforeAll(() => {
        c = createRnvConfig({ program: true }, { process: true }, 'command', 'subcommand');
        generateBuildConfig(c);
    });

    it('should create C variable correctly', async () => {
        const cKeys = Object.keys(c).sort();
        const expectKeys = [
            '_renativePluginCache',
            'api',
            'assetConfig',
            'buildConfig',
            'buildHooks',
            'buildPipes',
            'cli',
            'command',
            'configPropsInjects',
            'files',
            'isBuildHooksReady',
            'paths',
            'payload',
            'platform',
            'process',
            'program',
            'prompt',
            'rnvVersion',
            'runtime',
            'runtimePropsInjects',
            'spinner',
            'subCommand',
            'supportedPlatforms',
            'systemPropsInjects',
        ];

        expect(cKeys).toEqual(expectKeys);
    });

    it('should return app version 0 if not defined', () => {
        expect(getAppVersionCode(c, 'android')).toEqual('0');
    });
});
