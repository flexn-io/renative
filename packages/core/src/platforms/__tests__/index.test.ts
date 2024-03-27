import { createPlatformBuild } from '../../platforms';
import { copyFolderContentsRecursiveSync } from '../../system/fs';
import { getContext } from '../../context/provider';
import { doResolve } from '../../system/resolve';
import { generateContextDefaults } from '../../context/defaults';
import { getAppFolder } from '../../context/contextProps';

jest.mock('../../logger');
jest.mock('../../context/provider');
jest.mock('../../system/fs');
jest.mock('../../system/resolve');
jest.mock('../../context/contextProps');

beforeEach(() => {
    // NOTE: do not call createRnvContext() in core library itself
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('createPlatformBuild', () => {
    it('should copy platform template files to app folder', async () => {
        // GIVEN
        jest.mocked(getContext).mockReturnValue(generateContextDefaults());
        jest.mocked(doResolve).mockReturnValue('MOCK_RESOLVED_PATH');
        jest.mocked(getAppFolder).mockReturnValue('MOCKED_APP_FOLDER');
        const c = getContext();
        c.platform = 'ios';
        c.runtime.availablePlatforms = ['ios', 'android'];
        c.paths.project.platformTemplatesDirs['ios'] = '/path/to/pt';
        // WHEN
        await createPlatformBuild('ios');
        // THEN
        expect(copyFolderContentsRecursiveSync).toHaveBeenCalledWith(
            '/path/to/pt/ios',
            'MOCKED_APP_FOLDER', // TODO: fix this
            false,
            ['/path/to/pt/ios/_privateConfig'],
            false,
            [
                {
                    pattern: '{{PATH_REACT_NATIVE}}',
                    override: 'MOCK_RESOLVED_PATH',
                },
            ],
            undefined,
            c
        );
    });
});
