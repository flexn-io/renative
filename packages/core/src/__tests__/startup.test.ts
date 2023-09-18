import { generateBuildConfig } from '../configs';
import { createRnvContext } from '../context';
import { getAppVersionCode } from '../common';

jest.mock('fs');
jest.mock('../logging/logger.ts');

let c;

describe('Bootstrapping the CLI', () => {
    beforeAll(() => {
        c = createRnvContext({
            program: { program: true },
            process: { process: true },
            cmd: 'command',
            subCmd: 'subcommand',
            RNV_HOME_DIR: '',
        });
        generateBuildConfig(c);
    });

    it('should create C variable correctly', async () => {
        const cKeys = Object.keys(c).sort();
        const expectKeys = [
            '_renativePluginCache',
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
            'rnvVersion',
            'runtime',
            'runtimePropsInjects',
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
