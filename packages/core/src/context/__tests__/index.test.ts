import { createRnvContext } from '../index';
import { getContext } from '../provider';

jest.mock('fs');
jest.mock('process');
jest.mock('../../logger');

beforeEach(() => {
    // NOTE: do not call createRnvContext() in core library itself. It is not a mock
});

describe('Context tests', () => {
    it('test getContext returns object with keys', async () => {
        // GIVEN
        createRnvContext({
            program: {
                opts: () => ({}),
            } as any, //Not important for this test
            process: process,
            cmd: 'command',
            subCmd: 'subcommand',
            RNV_HOME_DIR: '',
        });
        // WHEN
        const cKeys = Object.keys(getContext()).sort();
        // THEN
        const expectKeys = [
            '_renativePluginCache',
            'assetConfig',
            'buildConfig',
            'buildHooks',
            'buildPipes',
            'cli',
            'command',
            'configPropsInjects',
            'engineConfigs',
            'files',
            'injectableConfigProps',
            'isBuildHooksReady',
            'isDefault',
            'isSystemLinux',
            'isSystemMac',
            'isSystemWin',
            'logging',
            'mutations',
            'paths',
            'payload',
            'platform',
            'process',
            'program',
            'rnvVersion',
            'runningProcesses',
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
        expect(getContext().command).toEqual('command');
    });
});
