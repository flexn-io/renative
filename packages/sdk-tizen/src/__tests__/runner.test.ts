import { createRnvApi, createRnvContext, execCLI, getContext } from '@rnv/core';
import { configureTizenGlobal, checkTizenStudioCert } from '../runner';
import path from 'path';

jest.mock('path', () => ({
    join: jest.fn(),
}));

describe('sdk_tizen runner', () => {
    beforeAll(() => {
        createRnvContext();
        createRnvApi();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('configureTizenGlobal', () => {
        const MOCKED_CERT_PATH = './mocked/cert/path.p12';
        jest.spyOn(path, 'join').mockReturnValue(MOCKED_CERT_PATH);

        it('should resolve if Tizen certificate exists', async () => {
            //GIVEN
            const c = getContext();
            jest.spyOn(require('@rnv/core'), 'fsExistsSync').mockReturnValueOnce(true);
            jest.spyOn(require('../runner'), 'checkTizenStudioCert').mockResolvedValueOnce(true);
            //WHEN
            await expect(configureTizenGlobal(c)).resolves.toBeUndefined();
            //THEN
        });

        it("should resolve after adding Tizen certificate if it doesn't exist in Tizen Studio", async () => {
            //GIVEN
            const c = getContext();
            jest.spyOn(require('@rnv/core'), 'fsExistsSync').mockReturnValueOnce(true);
            jest.spyOn(require('../runner'), 'checkTizenStudioCert').mockResolvedValueOnce(false);
            jest.spyOn(require('../deviceManager'), 'addDevelopTizenCertificate').mockResolvedValueOnce(undefined);

            //WHEN
            await expect(configureTizenGlobal(c)).resolves.toBeUndefined();
            //THEN
        });

        it('should resolve after adding Tizen certificate to the "workspace.dir" and Tizen Studio', async () => {
            //GIVEN
            const c = getContext();
            jest.spyOn(require('@rnv/core'), 'fsExistsSync').mockReturnValueOnce(false);
            jest.spyOn(require('../deviceManager'), 'createDevelopTizenCertificate').mockResolvedValueOnce(undefined);

            //WHEN
            await expect(configureTizenGlobal(c)).resolves.toBeUndefined();
            //THEN
        });
    });

    describe('checkTizenStudioCert', () => {
        it('should return true if the certificate profile exists', async () => {
            //GIVEN
            const c = getContext();
            jest.spyOn(require('@rnv/core'), 'execCLI').mockResolvedValueOnce('');
            //WHEN
            await expect(checkTizenStudioCert(c)).resolves.toBe(true);
            //THEN
        });
        it("should return false if the certificate profile doesn't exists", async () => {
            //GIVEN
            const c = getContext();
            jest.spyOn(require('@rnv/core'), 'execCLI').mockResolvedValueOnce(new Error('Error'));

            //WHEN
            await expect(checkTizenStudioCert(c)).resolves.toBe(false);
            //THEN
        });
    });
});
