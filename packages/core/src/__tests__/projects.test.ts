import { copyAssetsFolder } from '../projects';
import { getContext } from '../context/provider';
import { RnvPlatform } from '../types';
import * as platformsModule from '../platforms';
import * as commonModule from '../common';

jest.mock('../logger/index.ts', () => {
    return {
        logTask: jest.fn(),
        logWarning: jest.fn(),
        logInfo: jest.fn(),
        chalk: () => ({
            red: jest.fn(),
            white: jest.fn(),
        }),
    };
});

jest.mock('../platforms', () => ({
    isPlatformActive: jest.fn() as jest.Mock<boolean>,
}));

// jest.mock('../common.ts', () => ({
//     getConfigProp: jest.fn() as jest.Mock<string[]>,
// }));

// async function throwingFunction() {
//     throw new Error('This failed');
// }

describe('copyAssetsFolder', () => {
    const platform: RnvPlatform = 'web';
    const c = getContext();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should exit when platform is not active', async () => {
        (platformsModule.isPlatformActive as jest.Mock<boolean>).mockReturnValue(false);
        const result = await copyAssetsFolder(c, platform);

        expect(platformsModule.isPlatformActive).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });
    it('should throws an error when assetSources is declared but not specified', async () => {
        // (commonModule.getConfigProp as jest.Mock<[]>).mockReturnValue([]);
        const spy = jest.spyOn(commonModule, 'getConfigProp').mockReturnValueOnce('web').mockReturnValueOnce([]);
        expect(spy).toHaveBeenCalledWith(c, platform, 'assetFolderPlatform');
        expect(spy).toHaveBeenCalledWith(c, platform, 'assetSources');

        // await expect(throwingFunction()).rejects.toThrow();
        await expect(copyAssetsFolder(c, platform)).rejects.toThrowError(`AssetSources is declared but not specified.`);
        expect(spy).toHaveBeenCalledTimes(2);
        spy.mockRestore();
    });
});
