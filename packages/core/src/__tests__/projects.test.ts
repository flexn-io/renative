import { copyAssetsFolder } from '../projects';
import { getContext } from '../context/provider';
import { RnvPlatform } from '../types';
import * as platformsModule from '../platforms';
import * as configPropModule from '../configs/configProp';

import { logWarning } from '../logger';
import path from 'path';

jest.mock('fs');
jest.mock('path');
jest.mock('../logger/index.ts');

jest.mock('../platforms', () => ({
    isPlatformActive: jest.fn(),
}));

describe('copyAssetsFolder', () => {
    const platform: RnvPlatform = 'web';
    const c = getContext();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should exit when platform is not active', async () => {
        jest.mocked(platformsModule.isPlatformActive).mockReturnValue(false);
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

        jest.spyOn(platformsModule, 'isPlatformActive').mockReturnValue(true);
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
