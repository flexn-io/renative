import { createRnvApi, inquirerPrompt, inquirerSeparator } from '../index';

jest.mock('fs');
jest.mock('../../logger');

describe('Api tests', () => {
    beforeAll(() => {
        createRnvApi();
    });

    it('test uninitialized inquirerPrompt', async () => {
        const result = await inquirerPrompt({ type: 'list' });
        expect(result).toEqual(undefined);
    });

    it('test uninitialized inquirerSeparator', () => {
        const result = inquirerSeparator();
        expect(result).toEqual(undefined);
    });
});
