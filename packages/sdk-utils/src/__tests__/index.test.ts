import { getValidLocalhost, getDevServerHost } from '../';
import { DEFAULTS, createRnvApi, createRnvContext, getContext } from '@rnv/core';

describe('getValidLocalhost', () => {
    it('should return passed localhost when value is falsy', () => {
        const result = getValidLocalhost('', 'localhost');
        expect(result).toBe('localhost');
    });

    it('should return localhost for known values', () => {
        const values = ['localhost', '0.0.0.0', '127.0.0.1'];
        const localhost = 'localhost';
        values.forEach((value) => {
            const result = getValidLocalhost(value, localhost);
            expect(result).toBe(localhost);
        });
    });

    it('should return passed value for the rest cases', () => {
        const result = getValidLocalhost('unknownValue', 'localhost');
        expect(result).toBe('unknownValue');
    });
});

describe('getDevServerHost', () => {
    beforeAll(() => {
        createRnvContext();
        createRnvApi();
    });

    beforeEach(() => jest.clearAllMocks());

    it('should return DEFAULTS.devServerHost when devServerHost is not defined', () => {
        const c = getContext();
        c.runtime.localhost = '0.0.0.0 ';

        jest.spyOn(require('@rnv/core'), 'getConfigProp').mockReturnValue(undefined);

        const result = getDevServerHost(c);

        expect(result).toBe(DEFAULTS.devServerHost);
    });
    it('should return a fixed devServerHost when defined and equal to one of the known values', () => {
        const c = getContext();
        c.runtime.localhost = '0.0.0.0';

        jest.spyOn(require('@rnv/core'), 'getConfigProp').mockReturnValue('localhost');
        jest.spyOn(require('../'), 'getValidLocalhost').mockReturnValue('0.0.0.0');

        const result = getDevServerHost(c);

        expect(result).toBe('0.0.0.0');
    });
});
