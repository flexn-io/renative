import { createRnvApi } from '../../api';
import { generateApiDefaults } from '../../api/defaults';
import { getApi } from '../../api/provider';
import { generateContextDefaults } from '../../context/defaults';
import { getContext } from '../../context/provider';
import { executeAsync, commandExistsSync, commandExists } from '../../system/exec';

jest.mock('../../logger');
jest.mock('../../context/provider');
jest.mock('../../api/provider');

beforeAll(() => {
    createRnvApi();
});
beforeEach(() => {
    // NOTE: do not call createRnvContext() in core library itself. It is not a mock
    jest.mocked(getApi).mockReturnValue(generateApiDefaults());
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('Testing exec functions', () => {
    it('should execute command', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        // jest.mocked(spinner)
        expect.assertions(1);
        // WHEN // THEN
        await expect(executeAsync('node -v').then((data) => typeof data)).resolves.toBe('string');
    });

    it('should execute array command', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        expect.assertions(1);
        // WHEN // THEN
        await expect(executeAsync(['node', '-v']).then((data) => typeof data)).resolves.toBe('string');
    });

    it('should execute command with privateParams', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        expect.assertions(1);
        // WHEN // THEN
        await expect(
            executeAsync('node -v 1234', { privateParams: ['1234'] }).then((data) => typeof data)
        ).resolves.toBe('string');
    });

    it('should execute with error', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        expect.assertions(1);
        // WHEN // THEN
        await expect(executeAsync('shouldTrow')).rejects.toBeDefined();
    });

    it('should recognize command sync', () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        // WHEN // THEN
        expect(commandExistsSync('node')).toBe(true);
    });

    it('should recognize command async', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        expect.assertions(1);
        // WHEN // THEN
        await expect(commandExists('node')).resolves.toBe('node');
    });
});
