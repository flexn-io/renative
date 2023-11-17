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
        logError: jest.fn(),

        chalk: () => ({
            red: jest.fn(),
            white: jest.fn(),
            blue: jest.fn(),
        }),
    };
});

jest.mock('../platforms', () => ({
    isPlatformActive: jest.fn() as jest.Mock<boolean>,
}));

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
        //GIVEN
        const spy = jest.spyOn(commonModule, 'getConfigProp').mockReturnValueOnce('web').mockReturnValueOnce([]);
        (platformsModule.isPlatformActive as jest.Mock<boolean>).mockReturnValue(true);
        //WHEN
        await expect(copyAssetsFolder(c, platform)).rejects.toMatch(`AssetSources is declared but not specified.`);

        //THEN
        expect(spy).toHaveBeenCalledWith(c, platform, 'assetFolderPlatform');
        expect(spy).toHaveBeenCalledWith(c, platform, 'assetSources');

        expect(spy).toHaveBeenCalledTimes(2);
        spy.mockRestore();
    });
});
