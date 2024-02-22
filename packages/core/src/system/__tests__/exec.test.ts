import { createRnvApi } from '../../api';
import { createRnvContext } from '../../context';
import { generateContextDefaults } from '../../context/defaults';
import { executeAsync, commandExistsSync, commandExists } from '../../system/exec';

jest.mock('../../logger');

describe('Testing exec functions', () => {
    beforeAll(() => {
        createRnvContext();
        createRnvApi();
    });

    it('should execute command', async () => {
        expect.assertions(1);
        await expect(executeAsync(generateContextDefaults(), 'node -v').then((data) => typeof data)).resolves.toBe(
            'string'
        );
    });

    it('should execute array command', async () => {
        expect.assertions(1);
        await expect(executeAsync(generateContextDefaults(), ['node', '-v']).then((data) => typeof data)).resolves.toBe(
            'string'
        );
    });

    it('should execute command with privateParams', async () => {
        expect.assertions(1);
        await expect(
            executeAsync(generateContextDefaults(), 'node -v 1234', { privateParams: ['1234'] }).then(
                (data) => typeof data
            )
        ).resolves.toBe('string');
    });

    it('should execute with error', async () => {
        expect.assertions(1);
        await expect(executeAsync(generateContextDefaults(), 'shouldTrow')).rejects.toBeDefined();
    });

    it('should recognize command sync', () => {
        expect(commandExistsSync('node')).toBe(true);
    });

    it('should recognize command async', async () => {
        expect.assertions(1);
        await expect(commandExists('node')).resolves.toBe('node');
    });
});
