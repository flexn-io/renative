import { copyAssetsFolder } from '../projects';
import { getContext } from '../context/provider';
import { RnvPlatform } from '../types';
import * as platformsModule from '../platforms';
import * as configPropModule from '../configs/configProp';

import { logWarning } from '../logger';
import path from 'path';

jest.mock('../logger/index.ts', () => {
    return {
        logTask: jest.fn(),
        logWarning: jest.fn(),
        logInfo: jest.fn(),
        logError: jest.fn(),

        chalk: () => ({
            red: (v) => v,
            white: (v) => v,
            blue: (v) => v,
        }),
    };
});

jest.mock('../platforms', () => ({
    isPlatformActive: jest.fn() as jest.Mock<boolean>,
}));
jest.mock('path', () => ({
    join: jest.fn(),
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
    it('shows warning when assetSources is declared but actual folder is missing', async () => {
        //GIVEN
        const spy = jest
            .spyOn(configPropModule, 'getConfigProp')
            .mockReturnValueOnce('web')
            .mockReturnValueOnce(['./MOCK_PATH']);
        (platformsModule.isPlatformActive as jest.Mock<boolean>).mockReturnValue(true);

        // (path.join as jest.Mock<string>).mockReturnValue('MOST_JOINED_PATH');

        jest.spyOn(path, 'join').mockReturnValue('MOCK_JOINED_PATH');

        //WHEN
        await copyAssetsFolder(c, platform);

        //THEN
        expect(logWarning).toBeCalledWith(
            'AssetSources is specified as ./MOCK_PATH. But path MOCK_JOINED_PATH was not found.'
        );
        expect(spy).toHaveBeenCalledWith(c, platform, 'assetFolderPlatform');
        expect(spy).toHaveBeenCalledWith(c, platform, 'assetSources');

        expect(spy).toHaveBeenCalledTimes(2);
        spy.mockRestore();
    });
});
