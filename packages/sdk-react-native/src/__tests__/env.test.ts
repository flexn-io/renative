import { createRnvContext, getContext } from '@rnv/core';
import { EnvVars } from '../env';

jest.mock('@rnv/core');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('EnvVars', () => {
    it('test RCT_METRO_PORT', () => {
        // GIVEN
        const ctx = getContext();
        ctx.runtime.port = 999;
        // WHEN
        const result = EnvVars.RCT_METRO_PORT();
        // THEN
        expect(result.RCT_METRO_PORT).toEqual(999);
    });
});
