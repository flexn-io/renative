import { copyAssetsFolder } from '../projects';
import { RnvPlatform } from '../types';
import { logWarning } from '../logger';
import path from 'path';
import { isPlatformActive } from '../platforms';
import { getTimestampPathsConfig, getConfigProp } from '../context/contextProps';
import { generateContextDefaults } from '../context/defaults';

jest.mock('fs');
jest.mock('path');
jest.mock('../logger/index');
jest.mock('../context/provider');
jest.mock('../context/contextProps');
jest.mock('../platforms/index');

afterEach(() => {
    jest.clearAllMocks();
});

describe('copyAssetsFolder', () => {
    const platform: RnvPlatform = 'web';
    const c = generateContextDefaults();

    it('should exit when platform is not active', async () => {
        // GIVEN
        jest.mocked(isPlatformActive).mockReturnValue(false);
        // WHEN
        const result = await copyAssetsFolder(c, platform);
        //THEN
        expect(isPlatformActive).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it('shows warning when assetSources is declared but actual folder is missing', async () => {
        //GIVEN
        jest.mocked(isPlatformActive).mockReturnValue(true);
        jest.mocked(getConfigProp).mockReturnValueOnce('web'); //assetFolderPlatform
        jest.mocked(getTimestampPathsConfig).mockReturnValueOnce(undefined);
        jest.mocked(getConfigProp).mockReturnValueOnce(['./MOCK_PATH']); //assetSources
        jest.spyOn(path, 'join').mockReturnValue('MOCK_JOINED_PATH');
        //WHEN
        await copyAssetsFolder(c, platform);
        //THEN
        expect(logWarning).toHaveBeenCalledWith(
            'AssetSources is specified as ./MOCK_PATH. But path MOCK_JOINED_PATH was not found.'
        );
        expect(getConfigProp).toHaveBeenCalledWith(c, platform, 'assetFolderPlatform');
        expect(getConfigProp).toHaveBeenCalledWith(c, platform, 'assetSources');
        expect(getConfigProp).toHaveBeenCalledTimes(2);
    });
});
