import { executeAsync } from '../../src/systemTools/exec';

describe('Testing exec functions', () => {
    it('should execute command', async () => {
        const result = await executeAsync({}, 'node -v');
        expect(result).not.toBeNull();
    });

    it('should execute array command', async () => {
        const result = await executeAsync({}, ['node', '-v']);
        expect(result).not.toBeNull();
    });

    it('should execute with error', async () => {
        await expect(executeAsync({}, 'shouldTrow')).rejects;
    });
});
