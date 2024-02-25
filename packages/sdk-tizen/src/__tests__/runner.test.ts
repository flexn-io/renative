import { createRnvApi, createRnvContext, execCLI, fsExistsSync, getContext } from '@rnv/core';
import { configureTizenGlobal, checkTizenStudioCert } from '../runner';
import path from 'path';
import { addDevelopTizenCertificate, createDevelopTizenCertificate } from '../deviceManager';

jest.mock('path');
jest.mock('../deviceManager');
jest.mock('@rnv/core');

beforeEach(() => {
    createRnvContext();
    createRnvApi();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('configureTizenGlobal', () => {
    const MOCKED_CERT_PATH = './mocked/cert/path.p12';
    jest.spyOn(path, 'join').mockReturnValue(MOCKED_CERT_PATH);

    it('should resolve if Tizen certificate exists', async () => {
        //GIVEN
        const c = getContext();
        jest.mocked(fsExistsSync).mockReturnValueOnce(true);
        //WHEN
        await expect(configureTizenGlobal(c)).resolves.toBeUndefined();
        //THEN
    });

    it("should resolve after adding Tizen certificate if it doesn't exist in Tizen Studio", async () => {
        //GIVEN
        const c = getContext();
        jest.mocked(fsExistsSync).mockReturnValueOnce(true);
        jest.mocked(addDevelopTizenCertificate).mockResolvedValueOnce(undefined);
        //WHEN
        await expect(configureTizenGlobal(c)).resolves.toBeUndefined();
        //THEN
    });

    it('should resolve after adding Tizen certificate to the "workspace.dir" and Tizen Studio', async () => {
        //GIVEN
        const c = getContext();
        jest.mocked(fsExistsSync).mockReturnValueOnce(false);
        jest.mocked(createDevelopTizenCertificate).mockResolvedValueOnce(undefined);
        //WHEN
        await expect(configureTizenGlobal(c)).resolves.toBeUndefined();
        //THEN
    });
});

describe('checkTizenStudioCert', () => {
    it('should return true if the certificate profile exists', async () => {
        //GIVEN
        const c = getContext();
        jest.mocked(execCLI).mockResolvedValueOnce('');
        //WHEN
        await expect(checkTizenStudioCert(c)).resolves.toBe(true);
        //THEN
    });
    it("should return false if the certificate profile doesn't exist", async () => {
        //GIVEN
        const c = getContext();
        jest.mocked(execCLI).mockRejectedValueOnce(new Error('Error'));
        //WHEN
        await expect(checkTizenStudioCert(c)).resolves.toBe(false);
        //THEN
    });
});
