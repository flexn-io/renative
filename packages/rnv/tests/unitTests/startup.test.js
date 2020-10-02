import { createRnvConfig, generateBuildConfig } from '../../src/core/configManager/configParser';
import { getAppVersionCode } from '../../src/core/common';

jest.mock('../../src/core/systemManager/logger.js', () => {
    const _chalkCols = {
        white: v => v,
        green: v => v,
        red: v => v,
        yellow: v => v,
        default: v => v,
        gray: v => v,
        grey: v => v,
        blue: v => v,
        cyan: v => v,
        magenta: v => v
    };
    _chalkCols.rgb = () => v => v;
    _chalkCols.bold = _chalkCols;
    const _chalkMono = {
        ..._chalkCols
    };
    return {
        logToSummary: jest.fn(),
        logTask: jest.fn(),
        logDebug: jest.fn(),
        logInfo: jest.fn(),
        logError: jest.fn(),
        logWarning: jest.fn(),
        logSuccess: jest.fn(),
        chalk: () => _chalkMono
    };
});

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
