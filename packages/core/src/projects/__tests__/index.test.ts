import { copyAssetsFolder } from '..';
import { logWarning } from '../../logger';
import path from 'path';
import { isPlatformActive } from '../../platforms';
import { getTimestampPathsConfig, getConfigProp } from '../../context/contextProps';
import { generateContextDefaults } from '../../context/defaults';
import { getContext } from '../../context/provider';

jest.mock('fs');
jest.mock('path');
jest.mock('../../logger/index');
jest.mock('../../context/provider');
jest.mock('../../context/contextProps');
jest.mock('../../platforms/index');

afterEach(() => {
    jest.clearAllMocks();
});

describe('copyAssetsFolder', () => {
    it('should exit when platform is not active', async () => {
        // GIVEN
        const c = generateContextDefaults();
        c.platform = 'web';
        jest.mocked(getContext).mockReturnValue(c);
        jest.mocked(isPlatformActive).mockReturnValue(false);
        // WHEN
        const result = await copyAssetsFolder();
        //THEN
        expect(isPlatformActive).toHaveBeenCalled();
        expect(result).toBeUndefined();
    });

    it('shows warning when assetSources is declared but actual folder is missing', async () => {
        //GIVEN
        const c = generateContextDefaults();
        c.platform = 'web';
        jest.mocked(getContext).mockReturnValue(c);
        jest.mocked(isPlatformActive).mockReturnValue(true);
        jest.mocked(getConfigProp).mockReturnValueOnce('web'); //assetFolderPlatform
        jest.mocked(getTimestampPathsConfig).mockReturnValueOnce(undefined);
        jest.mocked(getConfigProp).mockReturnValueOnce(['./MOCK_PATH']); //assetSources
        jest.spyOn(path, 'join').mockReturnValue('MOCK_JOINED_PATH');
        //WHEN
        await copyAssetsFolder();
        //THEN
        expect(logWarning).toHaveBeenCalledWith(
            'AssetSources is specified as ./MOCK_PATH. But path MOCK_JOINED_PATH was not found.'
        );
        expect(getConfigProp).toHaveBeenCalledWith('assetFolderPlatform');
        expect(getConfigProp).toHaveBeenCalledWith('assetSources');
        expect(getConfigProp).toHaveBeenCalledTimes(2);
    });
});
