import { executeAsync, commandExistsSync, commandExists, executeTelnet } from '../../src/systemTools/exec';

describe('Testing exec functions', () => {
    it('should execute command', async () => {
        expect.assertions(1);
        await expect(executeAsync({}, 'node -v').then(data => typeof data)).resolves.toBe('string');
    });

    it('should execute array command', async () => {
        expect.assertions(1);
        await expect(executeAsync({}, ['node', '-v']).then(data => typeof data)).resolves.toBe('string');
    });

    it('should execute command with privateParams', async () => {
        expect.assertions(1);
        await expect(executeAsync({}, 'node %s', { privateParams: ['-v'] }).then(data => typeof data)).resolves.toBe('string');
    });

    it('should execute with error', async () => {
        expect.assertions(1);
        await expect(executeAsync({}, 'shouldTrow')).rejects.toBeDefined();
    });

    it('should recognize command sync', () => {
        expect(commandExistsSync('node')).toBe(true);
    });

    it('should recognize command async', async () => {
        expect.assertions(1);
        await expect(commandExists('node')).resolves.toBe('node');
    });

    it('should fail telnet', async () => {
        expect.assertions(1);
        await expect(executeTelnet(12345, 'node')).resolves.toBe('');
    });
});
