import { getEntryFile } from '@rnv/sdk-utils';
import path from 'path';
import { packageReactNativeAndroid } from '../androidRunner';
import { createRnvContext, getConfigProp, getContext, logInfo, chalk, getAppFolder, executeAsync } from '@rnv/core';

jest.mock('../env');
jest.mock('@rnv/core');
jest.mock('path');

beforeEach(() => {
    createRnvContext();
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('Test packageReactNativeAndroid', () => {
    it('should retun true when bundleAssets is false and platform is not androidwear ', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.runtime.scheme = 'SCHEME';
        jest.mocked(getConfigProp).mockReturnValue(false).mockReturnValueOnce(false);

        //WHEN
        await expect(packageReactNativeAndroid()).resolves.toBe(true);
        //THEN
        expect(logInfo).toHaveBeenCalledWith(
            `bundleAssets in scheme ${chalk().bold.white(ctx.runtime.scheme)} marked false. SKIPPING PACKAGING...`
        );
    });

    it('should call executeAsync with correct parameters ', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.runtime.scheme = 'SCHEME';
        ctx.buildConfig = {
            platforms: {
                android: {
                    entryFile: 'index',
                },
            },
        };

        jest.mocked(getConfigProp).mockReturnValueOnce(true).mockReturnValueOnce(false);
        jest.mocked(getAppFolder).mockReturnValue('mock-app-folder');
        jest.mocked(getEntryFile).mockReturnValue('index');
        path.join = jest
            .fn()
            .mockReturnValueOnce('mock-app-folder/app/src/main/res')
            .mockReturnValueOnce('mock-app-folder/app/src/main/assets/index.bundle');
        const expectedCmd = expect.stringContaining(
            `react-native bundle --platform android --dev false --assets-dest mock-app-folder/app/src/main/res --entry-file index.js --bundle-output mock-app-folder/app/src/main/assets/index.bundle --config=metro.config.js`
        );

        //WHEN
        const result = await packageReactNativeAndroid();

        //THEN
        expect(result).toBe(true);
        expect(executeAsync).toHaveBeenCalledWith(expectedCmd, { env: {} });
        expect(logInfo).toHaveBeenCalledWith(`ANDROID PACKAGE FINISHED`);
    });
    it('should call executeAsync with correct parameters and enable sourcemap ', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        ctx.runtime.scheme = 'SCHEME';
        ctx.buildConfig = {
            platforms: {
                android: {
                    entryFile: 'index',
                },
            },
        };

        jest.mocked(getConfigProp).mockReturnValueOnce(true).mockReturnValueOnce(true);
        jest.mocked(getAppFolder).mockReturnValue('mock-app-folder');
        jest.mocked(getEntryFile).mockReturnValue('index');
        path.join = jest
            .fn()
            .mockReturnValueOnce('mock-app-folder/app/src/main/res')
            .mockReturnValueOnce('mock-app-folder/app/src/main/assets/index.bundle')
            .mockReturnValueOnce('mock-app-folder/app/src/main/assets/index.bundle.map');
        const expectedCmd = expect.stringContaining(
            `react-native bundle --platform android --dev false --assets-dest mock-app-folder/app/src/main/res --entry-file index.js --bundle-output mock-app-folder/app/src/main/assets/index.bundle --config=metro.config.js --sourcemap-output mock-app-folder/app/src/main/assets/index.bundle.map`
        );

        //WHEN
        const result = await packageReactNativeAndroid();

        //THEN
        expect(result).toBe(true);
        expect(executeAsync).toHaveBeenCalledWith(expectedCmd, { env: {} });
        expect(logInfo).toHaveBeenCalledWith(`ANDROID PACKAGE FINISHED`);
    });

    it('should handle errors properly and log error message', async () => {
        //GIVEN
        const ctx = getContext();
        ctx.platform = 'android';
        path.join = jest.fn().mockReturnValue('mock-path');
        jest.mocked(getConfigProp).mockReturnValueOnce(true).mockReturnValueOnce(false);
        jest.mocked(executeAsync).mockRejectedValue(new Error('ERROR'));

        //WHEN
        await expect(packageReactNativeAndroid()).rejects.toThrow('ERROR');
        //THEN
        expect(logInfo).toHaveBeenCalledWith(`ANDROID PACKAGE FAILED`);
    });
});
