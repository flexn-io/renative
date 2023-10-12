import { generateBuildConfig } from '../configs/buildConfig';
import { createRnvContext } from '../context';
import { getAppVersionCode } from '../common';
import { createRnvApi } from '../api';
import { getContext } from '../context/provider';

jest.mock('fs');
jest.mock('../logger/index.ts');

describe('Bootstrapping the CLI', () => {
    beforeAll(() => {
        createRnvContext({
            program: { program: true },
            process: { process: true },
            cmd: 'command',
            subCmd: 'subcommand',
            RNV_HOME_DIR: '',
        });
        createRnvApi();
        generateBuildConfig();
    });

    it('should create C variable correctly', async () => {
        const cKeys = Object.keys(getContext()).sort();
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
            'isDefault',
            'isSystemWin',
            'logMessages',
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
            'timeEnd',
            'timeStart',
        ];

        expect(cKeys).toEqual(expectKeys);
    });

    it('should return app version 0 if not defined', () => {
        expect(getAppVersionCode(getContext(), 'android')).toEqual('0');
    });
});
