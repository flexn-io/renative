import { createRnvContext, getContext, getRealPath } from '@rnv/core';
import { launchWebOSimulator } from '../deviceManager';

jest.mock('@rnv/core');
jest.mock('path');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('launchWebOSimulator', () => {
    it('should fail if webos SDK path is not defined', async () => {
        //GIVEN
        const ctx = getContext();
        const target = true;
        const errorMessage = `c.buildConfig.sdks.WEBOS_SDK undefined`;

        //WHEN
        jest.mocked(getRealPath).mockReturnValue(undefined);

        //THEN
        await expect(launchWebOSimulator(ctx, target)).rejects.toBe(errorMessage);
    });
});
