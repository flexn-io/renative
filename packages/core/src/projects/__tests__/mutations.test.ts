import { handleMutations } from '../mutations';
import { getContext } from '../../context/provider';
import { inquirerPrompt } from '../../api';
import { updatePackage } from '../package';
import { logRaw, logWarning } from '../../logger';

jest.mock('../../context/provider');
jest.mock('../../api');
jest.mock('../package');
jest.mock('../../logger', () => ({
    ...jest.requireActual('../../logger'),
    logWarning: jest.fn(),
    logRaw: jest.fn(),
    chalk: () => ({
        bold: jest.fn((text) => text),
        red: jest.fn((text) => text),
        green: jest.fn((text) => text),
        gray: jest.fn((text) => text),
    }),
}));

describe('handleMutations', () => {
    it('should handle mutations correctly', async () => {
        // GIVEN
        const mockContext = {
            mutations: {
                pendingMutations: [
                    {
                        name: 'test',
                        original: { version: '1.0.0' },
                        updated: { version: '1.1.0' },
                        msg: 'test message',
                        source: 'test source',
                        type: 'test type',
                    },
                ],
            },
            buildConfig: { isTemplate: false },
            runtime: {
                isAppConfigured: true,
            }
        };
        (getContext as jest.Mock).mockReturnValue(mockContext);
        (inquirerPrompt as jest.Mock).mockResolvedValue({ confirm: 'Update package and install (recommended)' });

        // WHEN
        const result = await handleMutations();

        // THEN
        expect(result).toBe(true);
        expect(logWarning).toHaveBeenCalledWith('Updates to package.json are required:');
        expect(logRaw).toHaveBeenCalledWith('- test (1.0.0) => (1.1.0) test message | test source\n');
        expect(updatePackage).toHaveBeenCalledWith({ 'test type': { test: '1.1.0' } });
    });
});
